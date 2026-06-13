import { getMentoraTema, mentoraThemeStyle } from "@/lib/mentora-theme";
import { cn } from "@/lib/utils";

interface MentoraLayoutProps {
  mentora: { slug: string; corPrimaria: string; corFundo: string; corTexto: string };
  children: React.ReactNode;
  variant?: "centered" | "full";
  className?: string;
}

export default function MentoraLayout({
  mentora,
  children,
  variant = "centered",
  className,
}: MentoraLayoutProps) {
  const tema = getMentoraTema(mentora.slug);

  return (
    <main
      data-mentora-theme={tema ?? undefined}
      className={cn(
        "relative min-h-screen p-6",
        variant === "centered" && "flex items-center justify-center",
        variant === "full" && "flex flex-col",
        className,
      )}
      style={mentoraThemeStyle(mentora)}
    >
      {children}
    </main>
  );
}
