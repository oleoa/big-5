"use client";

import { useState } from "react";
import Link from "next/link";
import { MentoraPublica } from "@/types/mentora";
import MentoraLayout from "./MentoraLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function LandingPage({
  mentora,
  basePath,
}: {
  mentora: MentoraPublica;
  basePath: string;
}) {
  const [loading, setLoading] = useState(false);

  return (
    <MentoraLayout mentora={mentora}>
      <Card className="w-full max-w-md ring-0">
        <CardContent className="pt-8 pb-8 px-6 text-center">
          {mentora.logoPrincipalUrl && (
            <img
              src={mentora.logoPrincipalUrl}
              alt={mentora.nome}
              className={`h-44 mx-auto mb-8 object-contain${mentora.fotoCircular ? " rounded-full object-cover aspect-square" : ""}`}
            />
          )}

          <h1 className="text-3xl font-bold tracking-tight mb-4">
            {mentora.titulo}
          </h1>

          <p className="text-muted-foreground mb-10 leading-relaxed">
            {mentora.subtitulo}
          </p>

          <Button
            nativeButton={false}
            render={
              <Link
                href={`${basePath}/questionario`}
                onClick={() => setLoading(true)}
                aria-disabled={loading}
                className={loading ? "pointer-events-none" : ""}
              />
            }
            disabled={loading}
            className="h-12 px-8 text-base w-full"
          >
            {loading ? (
              <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent" />
            ) : (
              <>{mentora.textoBotao} →</>
            )}
          </Button>
        </CardContent>
      </Card>
    </MentoraLayout>
  );
}
