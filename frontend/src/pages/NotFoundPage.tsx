import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function NotFoundPage() {
  return (
    <div className="grid place-items-center gap-3 py-16 text-center">
      <h1 className="text-3xl font-bold">পাতা পাওয়া যায়নি</h1>
      <p className="text-muted-foreground">আপনি যে পাতাটি খুঁজছেন সেটি আর নেই।</p>
      <Button asChild>
        <Link to="/">হোমে ফিরে যান</Link>
      </Button>
    </div>
  );
}
