"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function SplashScreen({ onComplete }: { onComplete: () => void }) {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
      setTimeout(onComplete, 800); // Wait for exit animation
    }, 3000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white"
        >
          <div className="flex flex-col items-center space-y-6">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative w-32 h-32"
            >
              <Image
                src="/img/albadar.png"
                alt="Logo SMK Al Badar"
                fill
                className="object-contain"
                sizes="128px"
                priority
              />
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="text-center"
            >
              <h1 className="text-5xl font-extrabold tracking-tight">
                <span className="text-[#8B2FFC]">My </span>
                <span className="text-[#8B2FFC]">Badar</span>
              </h1>
              <div className="flex items-center justify-center space-x-2 mt-1">
                <span className="text-3xl font-bold text-zinc-900 italic">Badar</span>
                <span className="text-3xl font-bold text-[#FF923E] italic">Edu</span>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.2 }}
            className="absolute bottom-12 text-center"
          >
            <p className="text-lg text-zinc-600 font-medium">
              Powered by <span className="text-[#8B2FFC] font-bold">Hadi</span>
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
