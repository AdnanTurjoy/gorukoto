import { useState } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CATTLE_TYPE_EMOJI, CATTLE_TYPE_LABEL } from '@/lib/constants';
import { useCreatePurchase } from '@/hooks/usePurchases';
import { useUpload } from '@/hooks/useUpload';
import { useToast } from '@/components/ui/toast';
import { useAuthStore } from '@/stores/authStore';
import { apiErrorMessage } from '@/lib/api';
import type { CattleType } from '@/types';

const schema = z.object({
  cattleType: z.enum(['COW', 'BUFFALO', 'GOAT', 'SHEEP', 'CAMEL']),
  price: z.coerce.number().int().min(0),
  note: z.string().max(500).optional().or(z.literal('')),
  buyerName: z.string().max(80).optional().or(z.literal('')),
});

type FormValues = z.infer<typeof schema>;

export function PurchaseForm({ marketId }: { marketId: string }) {
  const user = useAuthStore((s) => s.user);
  const isAnonymous = !user;
  const [imageUrl, setImageUrl] = useState<string | undefined>();
  const create = useCreatePurchase(marketId);
  const upload = useUpload();
  const { toast } = useToast();
  const { register, handleSubmit, setValue, watch, reset, formState } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { cattleType: 'COW', price: 0, note: '', buyerName: '' },
  });

  const onPickImage = async (file: File) => {
    try {
      const { url } = await upload.mutateAsync(file);
      setImageUrl(url);
    } catch (err) {
      toast({ title: 'আপলোড ব্যর্থ', description: apiErrorMessage(err), variant: 'destructive' });
    }
  };

  const onSubmit = handleSubmit(async (values) => {
    if (!imageUrl) {
      toast({ title: 'একটি ছবি যোগ করুন', variant: 'destructive' });
      return;
    }
    const buyerName = values.buyerName?.trim();
    if (isAnonymous && (!buyerName || buyerName.length < 2)) {
      toast({ title: 'আপনার নাম দিন', variant: 'destructive' });
      return;
    }
    try {
      await create.mutateAsync({
        cattleType: values.cattleType,
        price: values.price,
        imageUrl,
        note: values.note || undefined,
        buyerName: isAnonymous ? buyerName : undefined,
      });
      toast({ title: 'শেয়ার হয়েছে', description: 'আপনার কেনা গরু সবার সাথে শেয়ার করা হয়েছে' });
      reset();
      setImageUrl(undefined);
    } catch (err) {
      toast({ title: 'শেয়ার ব্যর্থ', description: apiErrorMessage(err), variant: 'destructive' });
    }
  });

  return (
    <form onSubmit={onSubmit} className="space-y-3 rounded-xl border p-4">
      <div>
        <h3 className="font-semibold">গরু কিনছেন? শেয়ার করুন</h3>
        <p className="text-xs text-muted-foreground">
          এই হাট থেকে কী কিনলেন? ছবি ও দাম দিয়ে অন্যদের জানান।
        </p>
      </div>

      {isAnonymous && (
        <div className="grid gap-1">
          <Label>আপনার নাম</Label>
          <Input placeholder="যেমন: রহিম মিয়া" {...register('buyerName')} />
        </div>
      )}

      <div className="grid gap-2">
        <Label>ছবি</Label>
        {imageUrl ? (
          <div className="relative">
            <img src={imageUrl} alt="" className="aspect-[4/3] w-full rounded-lg object-cover" />
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="absolute right-2 top-2"
              onClick={() => setImageUrl(undefined)}
            >
              পরিবর্তন
            </Button>
          </div>
        ) : (
          <label className="flex aspect-[4/3] w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed text-sm text-muted-foreground hover:bg-muted/40">
            <Camera className="h-6 w-6" />
            <span>{upload.isPending ? 'আপলোড হচ্ছে…' : 'ছবি যোগ করুন'}</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && onPickImage(e.target.files[0])}
            />
          </label>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="grid gap-1">
          <Label>প্রাণী</Label>
          <Select
            value={watch('cattleType')}
            onValueChange={(v) => setValue('cattleType', v as CattleType, { shouldValidate: true })}
          >
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {(Object.keys(CATTLE_TYPE_LABEL) as CattleType[]).map((k) => (
                <SelectItem key={k} value={k}>
                  {CATTLE_TYPE_EMOJI[k]} {CATTLE_TYPE_LABEL[k]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-1">
          <Label>দাম (টাকা)</Label>
          <Input type="number" inputMode="numeric" {...register('price')} />
          {formState.errors.price && (
            <p className="text-xs text-destructive">{formState.errors.price.message}</p>
          )}
        </div>
      </div>

      <div className="grid gap-1">
        <Label>নোট (ঐচ্ছিক)</Label>
        <Textarea
          rows={2}
          placeholder="যেমন: ভালো দামে পেয়েছি, দরদাম করতে পেরেছি…"
          {...register('note')}
        />
      </div>

      <Button type="submit" className="w-full" disabled={create.isPending || upload.isPending || !imageUrl}>
        {create.isPending ? 'শেয়ার হচ্ছে…' : 'শেয়ার করুন'}
      </Button>
    </form>
  );
}
