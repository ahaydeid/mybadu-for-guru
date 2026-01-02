"use client";
export default function DateDisplay() {
  const today = new Date();
  return (
    <span suppressHydrationWarning>
      {today.toLocaleDateString("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      })}
    </span>
  );
}
