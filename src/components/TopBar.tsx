import { useEffect, useState } from "react";

export function TopBar({ playlistName }: { playlistName: string }) {
  const [mounted, setMounted] = useState(false);
  const [time, setTime] = useState<string>("");
  const [onlineCount, setOnlineCount] = useState<number>(0);

  useEffect(() => {
    setMounted(true);
    setTime(formatTime());
    setOnlineCount(Math.floor(Math.random() * 21) + 30);

    const timeInterval = setInterval(() => {
      setTime(formatTime());
    }, 1000);

    const onlineInterval = setInterval(() => {
      setOnlineCount((prev) => {
        const change = Math.round((Math.random() - 0.48) * 2);
        return Math.max(30, Math.min(50, prev + change));
      });
    }, Math.random() * 3000 + 7000);

    return () => {
      clearInterval(timeInterval);
      clearInterval(onlineInterval);
    };
  }, []);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-5 pb-4 text-sm font-medium text-white text-shadow-sm"
      style={{ paddingTop: "max(1rem, env(safe-area-inset-top))" }}
    >
      <span className="font-sans tabular-nums tracking-wide">
        {mounted ? time : "--:--"}
      </span>
      <span className="text-white/80">{playlistName}</span>
      <div className="online-pill flex items-center gap-2 rounded-full px-2.5 py-0.5">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping-slow" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
        </span>
        <span className="tabular-nums text-xs font-medium">
          {mounted ? `${onlineCount} online` : "-- online"}
        </span>
      </div>
    </header>
  );
}

function formatTime() {
  return new Date().toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}
