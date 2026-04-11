import { MentoraPublica } from '@/types/mentora';
import MentoraLayout from './MentoraLayout';
import { Card, CardContent } from '@/components/ui/card';

export default function ObrigadoPage({ mentora }: { mentora: MentoraPublica }) {
  return (
    <MentoraLayout mentora={mentora}>
      <Card className="w-full max-w-md">
        <CardContent className="pt-10 pb-10 px-8 text-center">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 bg-primary/10 text-primary">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-semibold mb-3">{mentora.tituloObrigado}</h1>
          <p className="text-muted-foreground">{mentora.textoObrigado}</p>
        </CardContent>
      </Card>
    </MentoraLayout>
  );
}
