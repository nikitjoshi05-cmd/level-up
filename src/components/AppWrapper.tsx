"use client";

import Navigation from "./Navigation";
import FloatingChatbot from "./FloatingChatbot";

export default function AppWrapper({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navigation />
      <main className="min-h-screen">
        {children}
      </main>
      <FloatingChatbot />
    </>
  );
}

