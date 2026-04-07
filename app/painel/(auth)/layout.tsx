"use client";

import { NeonAuthUIProvider } from "@neondatabase/auth/react/ui";
import { authClient } from "@/lib/auth/client";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

export default function PainelAuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <NeonAuthUIProvider
      authClient={authClient as any}
      basePath="/painel"
      navigate={(path) =>
        router.push(path.startsWith("/painel") ? path : `/painel${path}`)
      }
      replace={(path) =>
        router.replace(path.startsWith("/painel") ? path : `/painel${path}`)
      }
      onSessionChange={() => {
        if (pathname === "/painel/sign-out") {
          router.push("/painel/sign-in");
        } else {
          router.push("/painel");
        }
      }}
      Link={Link}
    >
      <div className="min-h-screen w-screen flex items-center justify-center bg-background">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </NeonAuthUIProvider>
  );
}
