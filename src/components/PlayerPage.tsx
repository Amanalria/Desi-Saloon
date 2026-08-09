import { Link, useLocation } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { TopBar } from "./TopBar";
import { MusicPlayer } from "./MusicPlayer";

const pages = [
  { to: "/", label: "पुराने गाने", playlistId: "PLAI9mVohmMrk" },
  { to: "/punjabi", label: "पंजाबी गाने", playlistId: "PLT41frwtG63E" },
  { to: "/anuv", label: "अनुव जैन", playlistId: "PLZfD4VXbKPMA" },
];

export function PlayerPage({
  playlistName,
  playlistId,
}: {
  playlistName: string;
  playlistId: string;
}) {
  const location = useLocation();
  const currentIndex = pages.findIndex((p) => p.to === location.pathname);
  const prevIndex = (currentIndex - 1 + pages.length) % pages.length;
  const nextIndex = (currentIndex + 1) % pages.length;

  return (
    <div className="bg-desi fixed inset-0 overflow-hidden">
      <TopBar playlistName={playlistName} />


      <Link
        to={pages[prevIndex]?.to ?? "/"}
        className="fixed left-2 top-1/2 z-40 flex h-10 w-10 -translate-y-1/2 items-center justify-center text-white/90 drop-shadow-[0_2px_10px_rgba(0,0,0,0.6)] transition hover:text-white hover:-translate-x-0.5 hover:scale-110 active:scale-95 sm:left-5"
        aria-label="Previous page"
      >
        <ChevronLeft className="h-8 w-8" strokeWidth={1.5} />
      </Link>
      <Link
        to={pages[nextIndex]?.to ?? "/"}
        className="fixed right-2 top-1/2 z-40 flex h-10 w-10 -translate-y-1/2 items-center justify-center text-white/90 drop-shadow-[0_2px_10px_rgba(0,0,0,0.6)] transition hover:text-white hover:translate-x-0.5 hover:scale-110 active:scale-95 sm:right-5"
        aria-label="Next page"
      >
        <ChevronRight className="h-8 w-8" strokeWidth={1.5} />
      </Link>

      <h1 className="font-saloon title-size title-shadow absolute left-1/2 top-[11%] w-full -translate-x-1/2 text-center text-white select-none">
        देसी
        <br />
        सैलून
      </h1>

      <div className="absolute bottom-0 left-0 right-0 z-30 w-full px-3 pb-5 sm:pb-6">
        <div className="mx-auto w-full max-w-lg">
          <MusicPlayer playlistId={playlistId} />

          <div className="mt-3 flex items-center justify-center gap-3">
            {pages.map((p, i) => (
              <Link
                key={p.to}
                to={p.to}
                className={`rounded-full transition-all ${
                  i === currentIndex
                    ? "h-2.5 w-2.5 bg-white"
                    : "h-2 w-2 bg-white/40 hover:bg-white/60"
                }`}
                aria-label={p.label}
              />
            ))}
          </div>

          <div className="mt-2 text-center text-[12px] text-white/70 text-shadow-sm">
            developed by{" "}
            <a
              href="https://amanalria.in"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-white hover:text-white/80"
            >
              Aman Alria
            </a>
          </div>
        </div>
      </div>

    </div>
  );
}

