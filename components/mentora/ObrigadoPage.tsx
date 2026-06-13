import { Check } from 'lucide-react';
import { MentoraPublica } from '@/types/mentora';
import MentoraLayout from './MentoraLayout';
import { Card, CardContent } from '@/components/ui/card';

export default function ObrigadoPage({ mentora }: { mentora: MentoraPublica }) {
  return (
    <MentoraLayout mentora={mentora}>
      <Card className="w-full max-w-md">
        <CardContent className="pt-10 pb-10 px-8 text-center">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 bg-primary/10 text-primary">
            <Check className="size-8" strokeWidth={2} />
          </div>
          <h1 className="text-2xl mb-3">{mentora.tituloObrigado}</h1>
          <p className="text-muted-foreground">{mentora.textoObrigado}</p>
        </CardContent>
      </Card>
    </MentoraLayout>
  );
}
