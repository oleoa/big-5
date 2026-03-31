"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import items from "@/data/ipip-neo-120-items.json";
import type { Answers, Item } from "@/lib/types";
import ProgressBar from "@/components/ProgressBar";
import QuestionCard from "@/components/QuestionCard";

const typedItems = items as Item[];
const STORAGE_KEY_ANSWERS = "big5-answers";
const STORAGE_KEY_INDEX = "big5-currentIndex";

export default function TestPage() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [direction, setDirection] = useState<"forward" | "backward">("forward");
  const [isHydrated, setIsHydrated] = useState(false);
  const advanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Restore state from localStorage on mount
  useEffect(() => {
    try {
      const savedAnswers = localStorage.getItem(STORAGE_KEY_ANSWERS);
      if (savedAnswers) {
        setAnswers(JSON.parse(savedAnswers));
      }
      const savedIndex = localStorage.getItem(STORAGE_KEY_INDEX);
      if (savedIndex) {
        setCurrentIndex(parseInt(savedIndex, 10));
      }
    } catch {
      // Ignore localStorage errors
    }
    setIsHydrated(true);
  }, []);

  // Persist answers to localStorage
  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY_ANSWERS, JSON.stringify(answers));
      localStorage.setItem(STORAGE_KEY_INDEX, String(currentIndex));
    } catch {
      // Ignore
    }
  }, [answers, currentIndex, isHydrated]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (advanceTimer.current) clearTimeout(advanceTimer.current);
    };
  }, []);

  const handleAnswer = useCallback(
    (value: number) => {
      if (advanceTimer.current) clearTimeout(advanceTimer.current);

      const itemId = typedItems[currentIndex].id;
      setAnswers((prev) => ({ ...prev, [itemId]: value }));

      if (currentIndex < typedItems.length - 1) {
        setDirection("forward");
        advanceTimer.current = setTimeout(() => {
          setCurrentIndex((prev) => prev + 1);
        }, 250);
      } else {
        // Last question answered — go to results
        advanceTimer.current = setTimeout(() => {
          router.push("/results");
        }, 300);
      }
    },
    [currentIndex, router]
  );

  const handleBack = useCallback(() => {
    if (currentIndex > 0) {
      if (advanceTimer.current) clearTimeout(advanceTimer.current);
      setDirection("backward");
      setCurrentIndex((prev) => prev - 1);
    }
  }, [currentIndex]);

  if (!isHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-foreground/40 text-lg">A carregar...</div>
      </div>
    );
  }

  const currentItem = typedItems[currentIndex];

  return (
    <main className="min-h-screen flex flex-col bg-background">
      {/* Header with progress */}
      <div className="sticky top-0 z-10 bg-surface/90 backdrop-blur-sm border-b border-border px-4 py-2">
        <div className="flex items-center">
          <Image
            src="/logo-horizontal.png"
            alt="Valquiria Abreu"
            width={140}
            height={35}
            className="shrink-0"
          />
          <div className="flex-1 flex justify-center">
            <div className="w-full max-w-md">
              <ProgressBar current={currentIndex + 1} total={typedItems.length} />
            </div>
          </div>
          <div className="w-35 shrink-0" />
        </div>
      </div>

      {/* Question area */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-8">
        <div className="w-full max-w-2xl">
          <QuestionCard
            key={currentIndex}
            item={currentItem}
            selectedValue={answers[currentItem.id]}
            onAnswer={handleAnswer}
            direction={direction}
          />
        </div>
      </div>

      {/* Navigation */}
      <div className="px-4 py-6 bg-surface border-t border-border">
        <div className="max-w-2xl mx-auto flex justify-between items-center">
          <button
            onClick={handleBack}
            disabled={currentIndex === 0}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium
              transition-all duration-200
              ${
                currentIndex === 0
                  ? "text-foreground/20 cursor-not-allowed"
                  : "text-foreground/60 hover:text-foreground hover:bg-background"
              }
            `}
            aria-label="Voltar à pergunta anterior"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Voltar
          </button>

          <span className="text-xs text-foreground/40">
            {Object.keys(answers).length} respondidas
          </span>
        </div>
      </div>
    </main>
  );
}
