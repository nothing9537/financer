import { Button } from '@/shared/ui/button';

export default function Dashboard() {
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <Button>
        Click me
      </Button>
      <p>Auth route</p>
    </div>
  );
}
