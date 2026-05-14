import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
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
import { CATTLE_TYPE_LABEL } from '@/lib/constants';
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
      toast({ title: 'আপডেট ব্যর্থ', description: apiErrorMessage(err), variant: 'destructive' });
    }
  });

  return (
    <form onSubmit={onSubmit} className="space-y-3 rounded-lg border p-4">
      <h3 className="font-semibold">আজকের দাম জানান</h3>
      <div className="grid gap-2">
        <Label>প্রাণী</Label>
        <Select
          value={watch('cattleType')}
          onValueChange={(v) => setValue('cattleType', v as CattleType, { shouldValidate: true })}
        >
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            {(Object.keys(CATTLE_TYPE_LABEL) as CattleType[]).map((k) => (
              <SelectItem key={k} value={k}>{CATTLE_TYPE_LABEL[k]}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label>সর্বনিম্ন (টাকা)</Label>
          <Input type="number" inputMode="numeric" {...register('minPrice')} />
        </div>
        <div>
          <Label>সর্বোচ্চ (টাকা)</Label>
          <Input type="number" inputMode="numeric" {...register('maxPrice')} />
        </div>
      </div>
      <div className="grid gap-2">
        <Label>নোট (ঐচ্ছিক)</Label>
        <Textarea placeholder="যেমন: গতকাল থেকে দাম একটু কমেছে" {...register('note')} />
      </div>
      <Button type="submit" disabled={create.isPending} className="w-full">
        {create.isPending ? 'পাঠানো হচ্ছে…' : 'আপডেট পাঠান'}
      </Button>
    </form>
  );
}
