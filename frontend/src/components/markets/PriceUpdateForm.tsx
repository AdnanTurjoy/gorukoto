import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { TrendingUp } from 'lucide-react';
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
import { useCreatePriceUpdate } from '@/hooks/usePriceUpdates';
import { useToast } from '@/components/ui/toast';
import { apiErrorMessage } from '@/lib/api';
import type { CattleType } from '@/types';

const schema = z
  .object({
    cattleType: z.enum(['COW', 'BUFFALO', 'GOAT', 'SHEEP']),
    minPrice: z.coerce.number().int().min(0),
    maxPrice: z.coerce.number().int().min(0),
    note: z.string().max(500).optional().or(z.literal('')),
  })
  .refine((d) => d.minPrice <= d.maxPrice, { message: 'min ≤ max', path: ['maxPrice'] });

type FormValues = z.infer<typeof schema>;

const PRICE_TYPES = (Object.keys(CATTLE_TYPE_LABEL) as CattleType[]).filter((k) => k !== 'CAMEL');

export function PriceUpdateForm({ marketId }: { marketId: string }) {
  const create = useCreatePriceUpdate(marketId);
  const { toast } = useToast();
  const { register, handleSubmit, setValue, watch, reset } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { cattleType: 'COW', minPrice: 0, maxPrice: 0, note: '' },
  });

  const onSubmit = handleSubmit(async (values) => {
    try {
      await create.mutateAsync({
        cattleType: values.cattleType,
        minPrice: values.minPrice,
        maxPrice: values.maxPrice,
        note: values.note || undefined,
      });
      toast({ title: 'দাম আপডেট হয়েছে' });
      reset();
    } catch (err) {
      toast({
        title: 'আপডেট ব্যর্থ',
        description: apiErrorMessage(err),
        variant: 'destructive',
      });
    }
  });

  return (
    <div className="overflow-hidden rounded-2xl border bg-card shadow-sm">
      <div className="flex items-center gap-2 border-b bg-muted/20 px-5 py-3.5">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10">
          <TrendingUp className="h-3.5 w-3.5 text-primary" />
        </span>
        <h3 className="text-sm font-bold">আজকের দাম জানান</h3>
      </div>

      <form onSubmit={onSubmit} className="space-y-4 p-5">
        <div className="space-y-1.5">
          <Label>প্রাণীর ধরন</Label>
          <Select
            value={watch('cattleType')}
            onValueChange={(v) => setValue('cattleType', v as 'COW' | 'BUFFALO' | 'GOAT' | 'SHEEP', { shouldValidate: true })}
          >
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {PRICE_TYPES.map((k) => (
                <SelectItem key={k} value={k}>
                  {CATTLE_TYPE_EMOJI[k]} {CATTLE_TYPE_LABEL[k]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label>সর্বনিম্ন (৳)</Label>
            <Input type="number" inputMode="numeric" {...register('minPrice')} />
          </div>
          <div className="space-y-1.5">
            <Label>সর্বোচ্চ (৳)</Label>
            <Input type="number" inputMode="numeric" {...register('maxPrice')} />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label>
            নোট{' '}
            <span className="text-xs font-normal text-muted-foreground">(ঐচ্ছিক)</span>
          </Label>
          <Textarea
            rows={2}
            placeholder="যেমন: গতকাল থেকে দাম একটু কমেছে…"
            {...register('note')}
          />
        </div>

        <Button type="submit" disabled={create.isPending} className="w-full">
          {create.isPending ? 'পাঠানো হচ্ছে…' : 'আপডেট পাঠান'}
        </Button>
      </form>
    </div>
  );
}
