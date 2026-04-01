"use client";

import { useRouter } from "next/navigation";

const STORAGE_KEY_ANSWERS = "big5-answers";
const STORAGE_KEY_INDEX = "big5-currentIndex";
const STORAGE_KEY_PERSONAL = "big5-personal";
const STORAGE_KEY_CLIENT_ID = "big5-clientId";

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
    localStorage.setItem(STORAGE_KEY_CLIENT_ID, "cd31397e-b355-47da-b691-bdcc12c1657b");
    router.push("/results");
  };

  const handleReset = () => {
    localStorage.removeItem(STORAGE_KEY_ANSWERS);
    localStorage.removeItem(STORAGE_KEY_INDEX);
    localStorage.removeItem(STORAGE_KEY_PERSONAL);
    localStorage.removeItem(STORAGE_KEY_CLIENT_ID);
  };

  if (process.env.NODE_ENV !== "development") return null;

  return (
    <div className="fixed bottom-4 right-4 flex gap-2 z-50">
      <button
        onClick={handleClick}
        className="bg-brand-blue text-white px-3 py-2 rounded-lg text-sm shadow-lg hover:bg-brand transition-colors"
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
