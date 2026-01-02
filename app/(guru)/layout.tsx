import { ReactNode } from "react";
import BottomNav from "./components/BottomNav";

export const metadata = {
  title: "My Badar - Mobile",
};

export default function GuruLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-zinc-900">
      <main className="flex-1">{children}</main>
      <BottomNav />
    </div>
  );
}
