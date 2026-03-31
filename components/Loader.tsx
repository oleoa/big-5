import Image from "next/image";

export default function Loader({ size = 64 }: { size?: number }) {
  return (
    <div className="flex flex-col items-center gap-4">
      <Image
        src="/icon.png"
        alt="A carregar"
        width={size}
        height={size}
        className="animate-spin-logo"
      />
      <span className="text-foreground/40 text-sm">A carregar...</span>
    </div>
  );
}
