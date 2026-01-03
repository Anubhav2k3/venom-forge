import { ReactNode } from "react";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <Header />
      <Sidebar />
      <main className="lg:pl-64 pt-6 min-h-[calc(100vh-64px)] bg-background">
        {children}
      </main>
    </div>
  );
}
