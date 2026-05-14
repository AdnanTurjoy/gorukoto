import { Skeleton } from '@/components/ui/skeleton';

export function LoadingScreen() {
  return (
    <div className="container mx-auto grid gap-4 p-6">
      <Skeleton className="h-10 w-1/3" />
      <Skeleton className="h-40 w-full" />
      <Skeleton className="h-40 w-full" />
    </div>
  );
}
