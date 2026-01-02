"use client";

import AnnouncementSection from "./components/dashboard/AnnouncementSection";
import HeroSection from "./components/dashboard/HeroSection";
import MenuSection from "./components/dashboard/MenuSection";
import TodaySection from "./components/dashboard/TodaySection";

export default function DashboardPage() {
  return (
    <div className="min-h-screen pb-15 bg-[#F9F9F9]">
      <HeroSection />
      <MenuSection />
      <TodaySection />
      <AnnouncementSection/>
    </div>
  );
}
