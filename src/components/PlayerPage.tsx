import { useCallback, useEffect, useState } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight, ChevronUp } from "lucide-react";
import { TopBar } from "./TopBar";
import { MusicPlayer, type PlayerQueue } from "./MusicPlayer";
import { SettingsPanel } from "./SettingsPanel";
import {
  DEFAULT_SOURCE,
  getStoredActivePlaylist,
  getStoredPlaylists,
  getStoredSource,
  storeActivePlaylist,
  storePlaylists,
  storeSource,
  type AudioSource,
  type UserPlaylist,
} from "../lib/audio-source";

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

  const [settingsOpen, setSettingsOpen] = useState(false);
  const [arrowAnimating, setArrowAnimating] = useState(false);
  const [source, setSource] = useState<AudioSource>(DEFAULT_SOURCE);
  const [playlists, setPlaylists] = useState<UserPlaylist[]>([]);
  const [activePlaylistId, setActivePlaylistId] = useState("");
  const [queue, setQueue] = useState<PlayerQueue | null>(null);

  useEffect(() => {
    setSource(getStoredSource());
    const stored = getStoredPlaylists();
    setPlaylists(stored);
    const active = getStoredActivePlaylist();
    setActivePlaylistId(active || stored[0]?.id || "");
  }, []);

  useEffect(() => {
    const prevent = (e: Event) => e.preventDefault();
    document.addEventListener("contextmenu", prevent);
    document.addEventListener("dragstart", prevent);
    return () => {
      document.removeEventListener("contextmenu", prevent);
      document.removeEventListener("dragstart", prevent);
    };
  }, []);

  const handleQueue = useCallback((q: PlayerQueue) => setQueue(q), []);

  const handleSourceChange = (s: AudioSource) => {
    setSource(s);
    storeSource(s);
  };

  const handlePlaylistsChange = (list: UserPlaylist[]) => {
    setPlaylists(list);
    storePlaylists(list);
    if (!list.some((p) => p.id === activePlaylistId)) {
      const next = list[0]?.id ?? "";
      setActivePlaylistId(next);
      storeActivePlaylist(next);
    }
  };

  const handleActivePlaylist = (id: string) => {
    setActivePlaylistId(id);
    storeActivePlaylist(id);
  };

  const openSettings = () => {
    setArrowAnimating(true);
    setSettingsOpen(true);
    setTimeout(() => setArrowAnimating(false), 600);
  };

  return (
    <div className="bg-desi fixed inset-0 overflow-hidden select-none">
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

      <div
        className="absolute bottom-0 left-0 right-0 z-30 w-full px-3"
        style={{ paddingBottom: "max(1.25rem, env(safe-area-inset-bottom))" }}
      >
        <div className="mx-auto w-full max-w-lg">
          <div className="mb-2 flex items-center justify-center">
            <button
              onClick={openSettings}
              className={`settings-arrow ${arrowAnimating ? "settings-arrow-bounce" : ""}`}
              aria-label="Open settings"
            >
              <ChevronUp className="h-5 w-5" strokeWidth={2.25} />
            </button>
          </div>
          <MusicPlayer
            playlistId={playlistId}
            source={source}
            userPlaylistId={activePlaylistId}
            onQueue={handleQueue}
          />

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

      <SettingsPanel
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        source={source}
        onSourceChange={handleSourceChange}
        playlists={playlists}
        onPlaylistsChange={handlePlaylistsChange}
        activePlaylistId={activePlaylistId}
        onActivePlaylistChange={handleActivePlaylist}
        queue={queue}
      />
    </div>
  );
}
