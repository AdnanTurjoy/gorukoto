import { useState } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Camera, ShoppingBag, X } from 'lucide-react';
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
import { apiErrorMessage } from '@/lib/api';
import type { CattleType } from '@/types';

const schema = z.object({
  cattleType: z.enum(['COW', 'BUFFALO', 'GOAT', 'SHEEP', 'CAMEL']),
  price: z.coerce.number().int().min(0),
  note: z.string().max(500).optional().or(z.literal('')),
});

type FormValues = z.infer<typeof schema>;

export function PurchaseForm({ marketId }: { marketId: string }) {
  const [imageUrl, setImageUrl] = useState<string | undefined>();
  const create = useCreatePurchase(marketId);
  const upload = useUpload();
  const { toast } = useToast();
  const { register, handleSubmit, setValue, watch, reset, formState } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { cattleType: 'COW', price: 0, note: '' },
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
    try {
      await create.mutateAsync({
        cattleType: values.cattleType,
        price: values.price,
        imageUrl,
        note: values.note || undefined,
      });
      toast({ title: 'শেয়ার হয়েছে', description: 'আপনার কেনা গরু সবার সাথে শেয়ার করা হয়েছে' });
      reset();
      setImageUrl(undefined);
    } catch (err) {
      toast({ title: 'শেয়ার ব্যর্থ', description: apiErrorMessage(err), variant: 'destructive' });
    }
  });

  return (
    <div className="overflow-hidden rounded-2xl border bg-card shadow-sm">
      <div className="flex items-center gap-2 border-b bg-muted/20 px-5 py-3.5">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10">
          <ShoppingBag className="h-3.5 w-3.5 text-primary" />
        </span>
        <h3 className="text-sm font-bold">গরু কিনেছেন? শেয়ার করুন</h3>
      </div>

      <form onSubmit={onSubmit} className="space-y-4 p-5">
        {/* Image upload */}
        <div className="space-y-1.5">
          <Label>ছবি</Label>
          {imageUrl ? (
            <div className="relative">
              <img
                src={imageUrl}
                alt=""
                className="aspect-[4/3] w-full rounded-xl object-cover ring-1 ring-border"
              />
              <button
                type="button"
                onClick={() => setImageUrl(undefined)}
                className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-background/80 backdrop-blur ring-1 ring-border transition hover:bg-background"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ) : (
            <label className="flex aspect-[4/3] w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed text-sm text-muted-foreground transition hover:bg-muted/30">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                <Camera className="h-5 w-5" />
              </span>
              <span className="font-medium">
                {upload.isPending ? 'আপলোড হচ্ছে…' : 'ছবি যোগ করুন'}
              </span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && onPickImage(e.target.files[0])}
              />
            </label>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
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
          <div className="space-y-1.5">
            <Label>দাম (৳)</Label>
            <Input type="number" inputMode="numeric" {...register('price')} />
            {formState.errors.price && (
              <p className="text-xs text-destructive">{formState.errors.price.message}</p>
            )}
          </div>
        </div>

        <div className="space-y-1.5">
          <Label>
            নোট{' '}
            <span className="text-xs font-normal text-muted-foreground">(ঐচ্ছিক)</span>
          </Label>
          <Textarea
            rows={2}
            placeholder="যেমন: ভালো দামে পেয়েছি, দরদাম করতে পেরেছি…"
            {...register('note')}
          />
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={create.isPending || upload.isPending || !imageUrl}
        >
          {create.isPending ? 'শেয়ার হচ্ছে…' : 'শেয়ার করুন'}
        </Button>
      </form>
    </div>
  );
}
