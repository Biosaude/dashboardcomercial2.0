import React from "react";
export default function HomePage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6 text-foreground">
      <section className="w-full max-w-2xl rounded-2xl border border-border bg-surface p-10 text-center shadow-sm">
        <p className="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-muted">
          Biosaúde Produtos Hospitalares
        </p>
        <h1 className="text-4xl font-semibold tracking-tight">Biosaúde Analytics 2.0</h1>
        <p className="mt-4 text-lg text-muted">A plataforma está em construção.</p>
      </section>
    </main>
  );
}
