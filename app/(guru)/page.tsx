import HeroSection from "./components/dashboard/HeroSection";
import MenuSection from "./components/dashboard/MenuSection";
import TodaySection from "./components/dashboard/TodaySection";

export default function DashboardPage() {
  return (
    <div suppressHydrationWarning={true} className="min-h-screen pb-15 bg-[#F9F9F9]">
      <HeroSection />
      <MenuSection />
      <TodaySection />
    </div>
  );
}
