"use client";

import type { Item } from "@/lib/types";

const LABELS = [
  "Discordo Totalmente",
  "Discordo",
  "Neutro",
  "Concordo",
  "Concordo Totalmente",
];

interface QuestionCardProps {
  item: Item;
  selectedValue?: number;
  onAnswer: (value: number) => void;
  direction: "forward" | "backward";
}

export default function QuestionCard({
  item,
  selectedValue,
  onAnswer,
  direction,
}: QuestionCardProps) {
  return (
    <div
      className={
        direction === "forward"
          ? "animate-slide-in-right"
          : "animate-slide-in-left"
      }
    >
      <h2 className="text-xl sm:text-2xl font-semibold text-foreground text-center mb-8 leading-relaxed">
        {item.text}
      </h2>

      <div className="flex flex-col gap-3 max-w-lg mx-auto">
        {LABELS.map((label, index) => {
          const value = index + 1;
          const isSelected = selectedValue === value;

          return (
            <button
              key={value}
              onClick={() => onAnswer(value)}
              className={`
                flex items-center gap-4 px-5 py-4 rounded-xl border-2 text-left
                transition-all duration-200 cursor-pointer
                ${
                  isSelected
                    ? "border-primary bg-primary/10 text-primary shadow-md"
                    : "border-border bg-surface text-foreground/70 hover:border-primary-light hover:bg-background"
                }
              `}
              aria-label={`${label} - ${value} de 5`}
            >
              <span
                className={`
                  shrink-0 w-9 h-9 rounded-full flex items-center justify-center
                  text-sm font-bold transition-all duration-200
                  ${
                    isSelected
                      ? "bg-primary text-white"
                      : "bg-background text-foreground/50"
                  }
                `}
              >
                {value}
              </span>
              <span className="font-medium text-sm sm:text-base">{label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
