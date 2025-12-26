import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CheckCircle2 } from 'lucide-react';

export default function ThanksPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4 bg-background">
      <div className="max-w-md w-full text-center">
        <CheckCircle2 className="h-20 w-20 text-cyan mx-auto mb-6" />
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-cyan to-purple bg-clip-text text-transparent">
          Thank You!
        </h1>
        <p className="text-xl text-text/80 mb-8">
          Your signal has been received. We'll be in touch soon to discuss your
          MVP.
        </p>
        <Button asChild className="bg-cyan hover:bg-cyan/90 text-background">
          <Link href="/">Return Home</Link>
        </Button>
      </div>
    </main>
  );
}

