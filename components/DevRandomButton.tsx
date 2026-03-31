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

  if (process.env.NODE_ENV !== "development") return null;

  return (
    <div className="fixed bottom-4 right-4 flex gap-2 z-50">
      <button
        onClick={handleClick}
        className="bg-primary text-white px-3 py-2 rounded-lg text-sm shadow-lg hover:bg-accent transition-colors"
      >
        Dev: Preencher Aleatório
      </button>
      <button
        onClick={handleReset}
        className="bg-surface text-foreground border border-border px-3 py-2 rounded-lg text-sm shadow-lg hover:bg-background transition-colors"
      >
        Dev: Reset
      </button>
    </div>
  );
}
