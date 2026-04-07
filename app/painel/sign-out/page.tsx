"use client";

import { useEffect, useRef } from "react";
import { authClient } from "@/lib/auth/client";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function PainelSignOutPage() {
  const signingOut = useRef(false);
  const router = useRouter();

  useEffect(() => {
    if (signingOut.current) return;
    signingOut.current = true;

    authClient.signOut().finally(() => {
      router.push("/painel/sign-in");
    });
  }, [router]);

  return (
    <div className="space-y-6 flex flex-col items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold">A terminar sessão...</h1>
      </div>
      <Loader2 className="animate-spin size-6" />
    </div>
  );
}
