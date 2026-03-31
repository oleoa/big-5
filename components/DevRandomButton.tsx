"use client";

import { useRouter } from "next/navigation";

const STORAGE_KEY_ANSWERS = "big5-answers";
const STORAGE_KEY_INDEX = "big5-currentIndex";
const STORAGE_KEY_PERSONAL = "big5-personal";

export default function DevRandomButton() {
  const router = useRouter();

  const handleClick = () => {
    const answers: Record<number, number> = {};
    for (let i = 1; i <= 120; i++) {
      answers[i] = Math.floor(Math.random() * 5) + 1;
    }
    localStorage.setItem(STORAGE_KEY_ANSWERS, JSON.stringify(answers));
    localStorage.setItem(
      STORAGE_KEY_PERSONAL,
      JSON.stringify({
        name: "Teste Dev",
        age: "30",
        email: "teste@dev.com",
        profession: "Desenvolvedor",
        children: "0",
      })
    );
    router.push("/results");
  };

  const handleReset = () => {
    localStorage.removeItem(STORAGE_KEY_ANSWERS);
    localStorage.removeItem(STORAGE_KEY_INDEX);
    localStorage.removeItem(STORAGE_KEY_PERSONAL);
  };

  return (
    <div className="flex gap-2 mt-3">
      <button
        onClick={handleClick}
        className="px-4 py-2 text-sm text-foreground/40 border border-border rounded-xl hover:bg-surface hover:text-foreground/60 transition-colors cursor-pointer"
      >
        Respostas Aleatórias (Dev)
      </button>
      <button
        onClick={handleReset}
        className="px-4 py-2 text-sm text-foreground/40 border border-border rounded-xl hover:bg-surface hover:text-foreground/60 transition-colors cursor-pointer"
      >
        Resetar Respostas (Dev)
      </button>
    </div>
  );
}
