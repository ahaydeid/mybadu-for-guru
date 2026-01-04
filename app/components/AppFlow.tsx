"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import SplashScreen from "./SplashScreen";
import Onboarding from "./Onboarding";

export default function AppFlow({ children }: { children: React.ReactNode }) {
  const [isSplashActive, setIsSplashActive] = useState(true);
  const [isOnboardingActive, setIsOnboardingActive] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <AnimatePresence mode="wait">
        {isSplashActive && (
          <SplashScreen 
            key="splash"
            onComplete={() => {
              setIsSplashActive(false);
              // Hanya tampilkan onboarding jika di halaman /login
              if (pathname === "/login") {
                setIsOnboardingActive(true);
              }
            }} 
          />
        )}
        {isOnboardingActive && (
          <Onboarding 
            key="onboarding"
            onComplete={() => setIsOnboardingActive(false)} 
          />
        )}
      </AnimatePresence>
      {!isSplashActive && !isOnboardingActive && (
        <div suppressHydrationWarning={true}>{children}</div>
      )}
    </>
  );
}
