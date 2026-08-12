import { useEffect, useState } from "react";
import { ListMusic, Maximize2, Music2, Plus, Trash2, X } from "lucide-react";
import {
  MAX_USER_PLAYLISTS,
  parsePlaylistId,
  type AudioSource,
  type UserPlaylist,
} from "../lib/audio-source";
import type { PlayerQueue } from "./MusicPlayer";

const SOURCES: { value: AudioSource; label: string; hint: string }[] = [
  {
    value: "our-playlist",
    label: "हमारी Playlist",
    hint: "पुराने गाने, पंजाबी, अनुव जैन",
  },
  {
    value: "my-youtube",
    label: "मेरी YouTube Playlist",
    hint: `अपनी playlist लगाओ (max ${MAX_USER_PLAYLISTS})`,
  },
];

export function SettingsPanel({
  open,
  onClose,
  source,
  onSourceChange,
  playlists,
  onPlaylistsChange,
  activePlaylistId,
  onActivePlaylistChange,
  queue,
}: {
  open: boolean;
  onClose: () => void;
  source: AudioSource;
  onSourceChange: (s: AudioSource) => void;
  playlists: UserPlaylist[];
  onPlaylistsChange: (list: UserPlaylist[]) => void;
  activePlaylistId: string;
  onActivePlaylistChange: (id: string) => void;
  queue: PlayerQueue | null;
}) {
  const [playlistInput, setPlaylistInput] = useState("");
  const [nameInput, setNameInput] = useState("");
  const [error, setError] = useState("");
  const [showTracks, setShowTracks] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handler);
    handler();
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);

  function addPlaylist() {
    const id = parsePlaylistId(playlistInput);
    if (!id) {
      setError("Playlist URL ya ID daalo");
      return;
    }
    if (playlists.length >= MAX_USER_PLAYLISTS) {
      setError(`Max ${MAX_USER_PLAYLISTS} playlists hi save ho sakti hain`);
      return;
    }
    if (playlists.some((p) => p.id === id)) {
      setError("Ye playlist pehle se added hai");
      return;
    }
    const next = [...playlists, { id, name: nameInput.trim() || `Playlist ${playlists.length + 1}` }];
    onPlaylistsChange(next);
    onActivePlaylistChange(id);
    setPlaylistInput("");
    setNameInput("");
    setError("");
  }

  function removePlaylist(id: string) {
    onPlaylistsChange(playlists.filter((p) => p.id !== id));
  }

  async function toggleFullscreen() {
    try {
      if (!document.fullscreenElement) await document.documentElement.requestFullscreen();
      else await document.exitFullscreen();
    } catch {
      // ignore
    }
  }

  return (
    <>
      <div
        className={`fixed inset-0 z-[90] bg-black/40 transition-opacity duration-300 ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className={`settings-panel fixed bottom-0 left-0 right-0 z-[100] max-h-[80vh] overflow-y-auto ${
          open ? "settings-panel-open" : ""
        }`}
        style={{ paddingBottom: "max(2.5rem, env(safe-area-inset-bottom))" }}
        role="dialog"
        aria-label="Settings"
      >
        <div className="panel-handle" />
        <button
          onClick={onClose}
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white/80 transition hover:bg-white/20"
          aria-label="Close settings"
        >
          <X className="h-4 w-4" />
        </button>

        <section className="mb-5">
          <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-white/90">
            <Music2 className="h-4 w-4" /> Audio Source
          </h2>
          {SOURCES.map((s) => (
            <button
              key={s.value}
              onClick={() => onSourceChange(s.value)}
              className={`source-option w-full text-left ${
                source === s.value ? "source-option-selected" : ""
              }`}
            >
              <span
                className={`flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full border ${
                  source === s.value ? "border-white" : "border-white/40"
                }`}
              >
                {source === s.value && <span className="h-2 w-2 rounded-full bg-white" />}
              </span>
              <span className="flex flex-col">
                <span className="text-sm font-medium text-white">{s.label}</span>
                <span className="text-xs text-white/55">{s.hint}</span>
              </span>
            </button>
          ))}

          {source === "my-youtube" && (
            <div className="mt-2">
              {playlists.map((p) => (
                <div
                  key={p.id}
                  className={`search-result w-full ${
                    activePlaylistId === p.id ? "search-result-active" : ""
                  }`}
                >
                  <button
                    onClick={() => onActivePlaylistChange(p.id)}
                    className="flex min-w-0 flex-1 flex-col text-left"
                  >
                    <span className="truncate text-sm text-white">{p.name}</span>
                    <span className="truncate text-xs text-white/50">{p.id}</span>
                  </button>
                  <button
                    onClick={() => removePlaylist(p.id)}
                    className="ml-2 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-white/60 transition hover:bg-white/10 hover:text-white"
                    aria-label={`Remove ${p.name}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}

              {playlists.length < MAX_USER_PLAYLISTS ? (
                <>
                  <input
                    className="playlist-input"
                    placeholder="YouTube Playlist URL paste karo..."
                    value={playlistInput}
                    onChange={(e) => setPlaylistInput(e.target.value)}
                  />
                  <input
                    className="playlist-input"
                    placeholder="Naam (optional)"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                  />
                  <button
                    onClick={addPlaylist}
                    className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-white/85 px-5 py-1.5 text-sm font-semibold text-black transition hover:bg-white"
                  >
                    <Plus className="h-4 w-4" /> Add
                  </button>
                </>
              ) : (
                <p className="mt-2 text-xs text-white/55">
                  Max {MAX_USER_PLAYLISTS} playlists add ho chuki hain.
                </p>
              )}
              <p className="mt-2 text-xs text-white/45">
                {playlists.length}/{MAX_USER_PLAYLISTS} playlists
              </p>
              {error && <p className="mt-1 text-xs text-red-300">{error}</p>}
            </div>
          )}
        </section>

        <section className="mb-5">
          <button
            onClick={() => setShowTracks((v) => !v)}
            className="toggle-row w-full"
            aria-expanded={showTracks}
          >
            <span className="flex items-center gap-2 text-sm font-medium text-white">
              <ListMusic className="h-4 w-4" /> Playlist
            </span>
            <span className="text-xs text-white/55">
              {queue?.tracks.length ? `${queue.tracks.length} songs` : "Loading..."}
            </span>
          </button>
          {showTracks && (
            <div className="mt-2 max-h-56 overflow-y-auto pr-1">
              {queue?.tracks.map((track, i) => (
                <button
                  key={`${track.id}-${i}`}
                  onClick={() => {
                    queue.playAt(i);
                    onClose();
                  }}
                  className={`search-result w-full text-left ${
                    queue.index === i ? "search-result-active" : ""
                  }`}
                >
                  <img
                    src={`https://img.youtube.com/vi/${track.id}/default.jpg`}
                    alt=""
                    className="h-10 w-10 rounded-lg object-cover"
                  />
                  <span className="truncate text-sm text-white">{track.title}</span>
                </button>
              ))}
            </div>
          )}
        </section>

        <section>
          <div className="toggle-row">
            <span className="flex items-center gap-2 text-sm font-medium text-white">
              <Maximize2 className="h-4 w-4" /> Fullscreen Mode
            </span>
            <button
              onClick={toggleFullscreen}
              className={`liquid-switch relative h-7 w-12 rounded-full ${
                isFullscreen ? "liquid-switch-on" : ""
              }`}
              aria-pressed={isFullscreen}
              aria-label="Fullscreen mode"
            >
              <span
                className={`liquid-knob absolute top-1/2 block h-[22px] w-[22px] -translate-y-1/2 rounded-full transition-all duration-300 ease-out ${
                  isFullscreen ? "left-[23px]" : "left-[2px]"
                }`}
              />
            </button>
          </div>
        </section>
      </div>
    </>
  );
}
