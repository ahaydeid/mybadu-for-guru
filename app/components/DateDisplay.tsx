import { useState, useEffect } from "react";

export default function DateDisplay() {
  const [mounted, setMounted] = useState(false);
  const [dateStr, setDateStr] = useState("");

  useEffect(() => {
    setDateStr(new Date().toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }));
    setMounted(true);
  }, []);

  return (
    <span suppressHydrationWarning>
      {mounted ? dateStr : "..."}
    </span>
  );
}
