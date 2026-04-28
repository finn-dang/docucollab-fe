"use client";

import { useEffect, useState } from "react";

interface TypingUser {
  userId: string;
  userName: string;
}

interface TypingIndicatorProps {
  typingUsers: TypingUser[];
}

export default function TypingIndicator({ typingUsers }: TypingIndicatorProps) {
  const [dots, setDots] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  if (typingUsers.length === 0) return null;

  const getTypingText = () => {
    if (typingUsers.length === 1) {
      return `${typingUsers[0].userName} is typing${dots}`;
    }
    if (typingUsers.length === 2) {
      return `${typingUsers[0].userName} and ${typingUsers[1].userName} are typing${dots}`;
    }
    return `${typingUsers.length} people are typing${dots}`;
  };

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100/80 backdrop-blur-sm rounded-full shadow-sm border border-gray-200/50 animate-in fade-in slide-in-from-bottom-1 duration-200">
      {/* Modern animated dots */}
      <div className="flex gap-1">
        <div
          className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-pulse"
          style={{ animationDelay: "0ms" }}
        />
        <div
          className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-pulse"
          style={{ animationDelay: "150ms" }}
        />
        <div
          className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-pulse"
          style={{ animationDelay: "300ms" }}
        />
      </div>
      <span className="text-xs font-medium text-gray-600 tracking-wide">{getTypingText()}</span>
    </div>
  );
}
