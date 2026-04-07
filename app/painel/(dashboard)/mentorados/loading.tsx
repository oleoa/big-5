import { Loader2 } from 'lucide-react';

export default function MentoradosLoading() {
  return (
    <div className="flex items-center justify-center h-full min-h-[50vh]">
      <Loader2 className="size-8 animate-spin text-muted-foreground" />
    </div>
  );
}
