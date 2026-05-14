import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Camera, MapPin, Plus } from 'lucide-react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
import { useMarkets } from '@/hooks/useMarkets';
import { useCreatePurchase } from '@/hooks/usePurchases';
import { useUpload } from '@/hooks/useUpload';
import { useToast } from '@/components/ui/toast';
import { useAuthStore } from '@/stores/authStore';
import { apiErrorMessage } from '@/lib/api';
import { CATTLE_TYPE_EMOJI, CATTLE_TYPE_LABEL } from '@/lib/constants';
import type { CattleType } from '@/types';

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}

const schema = z.object({
  cattleType: z.enum(['COW', 'BUFFALO', 'GOAT', 'SHEEP', 'CAMEL']),
  price: z.coerce.number().int().min(1, 'দাম দিন'),
  note: z.string().max(500).optional().or(z.literal('')),
});

type FormValues = z.infer<typeof schema>;

export function GoruKinchenDialog({ open, onOpenChange }: Props) {
  const token = useAuthStore((s) => s.token);
  const [marketId, setMarketId] = useState<string>('');
  const [imageUrl, setImageUrl] = useState<string | undefined>();
  const { data: marketsData, isLoading: marketsLoading } = useMarkets({ limit: 100 });
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

  const handleClose = () => {
    onOpenChange(false);
    setTimeout(() => {
      reset();
      setImageUrl(undefined);
      setMarketId('');
    }, 200);
  };

  const onSubmit = handleSubmit(async (values) => {
    if (!marketId) {
      toast({ title: 'হাট নির্বাচন করুন', variant: 'destructive' });
      return;
    }
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
      handleClose();
    } catch (err) {
      toast({ title: 'শেয়ার ব্যর্থ', description: apiErrorMessage(err), variant: 'destructive' });
    }
  });

  return (
    <Dialog open={open} onOpenChange={(v) => (v ? onOpenChange(true) : handleClose())}>
      <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>গরু কিনছেন? শেয়ার করুন</DialogTitle>
          <DialogDescription>
            কোন হাট থেকে কিনলেন, কী কিনলেন এবং কত টাকায় — অন্যদের জানান।
          </DialogDescription>
        </DialogHeader>

        {!token ? (
          <div className="rounded-md border bg-muted/40 p-4 text-sm">
            শেয়ার করতে অনুগ্রহ করে{' '}
            <Link to="/login" className="font-medium text-primary underline" onClick={handleClose}>
              লগইন করুন
            </Link>
            ।
          </div>
        ) : (
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="grid gap-2">
              <Label>কোন হাট থেকে?</Label>
              <Select value={marketId} onValueChange={setMarketId} disabled={marketsLoading}>
                <SelectTrigger>
                  <SelectValue placeholder={marketsLoading ? 'লোড হচ্ছে…' : 'হাট নির্বাচন করুন'} />
                </SelectTrigger>
                <SelectContent>
                  {marketsData?.items.map((m) => (
                    <SelectItem key={m.id} value={m.id}>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-muted-foreground" />
                        {m.name} <span className="text-muted-foreground">— {m.district}</span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Link
                to="/add"
                onClick={handleClose}
                className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
              >
                <Plus className="h-3 w-3" /> তালিকায় নেই? নতুন হাট যোগ করুন
              </Link>
            </div>

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

            <div className="flex gap-2 pt-2">
              <Button type="button" variant="outline" className="flex-1" onClick={handleClose}>
                বাতিল
              </Button>
              <Button
                type="submit"
                className="flex-1"
                disabled={create.isPending || upload.isPending || !imageUrl || !marketId}
              >
                {create.isPending ? 'শেয়ার হচ্ছে…' : 'শেয়ার করুন'}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
