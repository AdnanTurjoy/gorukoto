import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useCreateReview } from '@/hooks/useReviews';
import { useToast } from '@/components/ui/toast';
import { apiErrorMessage } from '@/lib/api';
import { PRICE_LEVEL_LABEL } from '@/lib/constants';
import type { PriceLevel } from '@/types';

const schema = z.object({
  priceTag: z.enum(['CHEAP', 'FAIR', 'EXPENSIVE']),
  comment: z.string().min(3, 'অন্তত ৩ অক্ষর লিখুন').max(2000),
});

type FormValues = z.infer<typeof schema>;

export function ReviewForm({ marketId }: { marketId: string }) {
  const create = useCreateReview(marketId);
  const { toast } = useToast();
  const { register, handleSubmit, setValue, watch, reset, formState } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { priceTag: 'FAIR', comment: '' },
  });

  const onSubmit = handleSubmit(async (values) => {
    try {
      await create.mutateAsync(values);
      toast({ title: 'রিভিউ পোস্ট হয়েছে' });
      reset();
    } catch (err) {
      toast({ title: 'পোস্ট করতে সমস্যা হয়েছে', description: apiErrorMessage(err), variant: 'destructive' });
    }
  });

  return (
    <form onSubmit={onSubmit} className="space-y-3 rounded-lg border p-4">
      <h3 className="font-semibold">রিভিউ দিন</h3>
      <div className="grid gap-2">
        <Label>দাম কেমন?</Label>
        <Select
          value={watch('priceTag')}
          onValueChange={(v) => setValue('priceTag', v as PriceLevel, { shouldValidate: true })}
        >
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="CHEAP">{PRICE_LEVEL_LABEL.CHEAP}</SelectItem>
            <SelectItem value="FAIR">{PRICE_LEVEL_LABEL.FAIR}</SelectItem>
            <SelectItem value="EXPENSIVE">{PRICE_LEVEL_LABEL.EXPENSIVE}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-2">
        <Label>মন্তব্য</Label>
        <Textarea placeholder="আপনার অভিজ্ঞতা লিখুন…" {...register('comment')} />
        {formState.errors.comment && (
          <p className="text-xs text-destructive">{formState.errors.comment.message}</p>
        )}
      </div>

      <Button type="submit" disabled={create.isPending} className="w-full">
        {create.isPending ? 'পোস্ট হচ্ছে…' : 'রিভিউ পোস্ট করুন'}
      </Button>
    </form>
  );
}
