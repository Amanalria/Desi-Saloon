import { useEffect, useRef, useState } from "react";
import { Play, Pause, SkipBack, SkipForward } from "lucide-react";

interface YouTubePlayer {
  playVideo: () => void;
  pauseVideo: () => void;
  nextVideo: () => void;
  previousVideo: () => void;
  seekTo: (seconds: number, allowSeekAhead: boolean) => void;
  getCurrentTime: () => number;
  getDuration: () => number;
  getPlayerState: () => number;
  getVideoData: () => { title?: string; video_id?: string; author?: string };
  destroy: () => void;
  getPlaylistIndex: () => number;
}

declare global {
  interface Window {
    YT?: {
      Player: new (
        elementId: string,
        options: {
          playerVars: Record<string, number | string>;
          events: {
            onReady?: (event: { target: YouTubePlayer }) => void;
            onStateChange?: (event: { data: number; target: YouTubePlayer }) => void;
          };
        }
      ) => YouTubePlayer;
      PlayerState?: {
        PLAYING: number;
        PAUSED: number;
        ENDED: number;
      };
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}

const PLAYING = 1;
const PAUSED = 2;
const ENDED = 0;

export function MusicPlayer({ playlistId }: { playlistId: string }) {
  const [player, setPlayer] = useState<YouTubePlayer | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [videoTitle, setVideoTitle] = useState("Loading playlist...");
  const [videoId, setVideoId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const apiLoadedRef = useRef(false);

  useEffect(() => {
    if (apiLoadedRef.current) return;
    apiLoadedRef.current = true;

    const existing = document.getElementById("youtube-api");
    if (!existing) {
      const tag = document.createElement("script");
      tag.id = "youtube-api";
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScript = document.getElementsByTagName("script")[0];
      if (firstScript && firstScript.parentNode) {
        firstScript.parentNode.insertBefore(tag, firstScript);
      }
    }


    const initPlayer = () => {
      if (!window.YT || !containerRef.current) return;
      const playerId = `youtube-player-${playlistId}`;
      containerRef.current.id = playerId;

      const newPlayer = new window.YT.Player(playerId, {
        playerVars: {
          listType: "playlist",
          list: playlistId,
          autoplay: 1,
          playsinline: 1,
          controls: 0,
          rel: 0,
          showinfo: 0,
          modestbranding: 1,
        },

        events: {
          onReady: (event) => {
            setPlayer(event.target);
            setDuration(event.target.getDuration() || 0);
            updateMetadata(event.target);
            try {
              event.target.playVideo();
            } catch {
              // autoplay may be blocked until user interaction
            }
          },

          onStateChange: (event) => {
            setIsPlaying(event.data === PLAYING);
            setDuration(event.target.getDuration() || 0);
            updateMetadata(event.target);
          },
        },
      });
    };

    const previousReady = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      initPlayer();
      if (typeof previousReady === "function") previousReady();
    };

    if (window.YT && window.YT.Player) {
      initPlayer();
    }

    return () => {
      try {
        player?.destroy?.();
      } catch {
        // ignore
      }
    };
  }, [playlistId]);

  useEffect(() => {
    if (!player) return;
    const interval = setInterval(() => {
      try {
        setCurrentTime(player.getCurrentTime() || 0);
        setDuration(player.getDuration() || 0);
      } catch {
        // player may not be ready
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [player]);

  function updateMetadata(p: YouTubePlayer) {
    try {
      const data = p.getVideoData();
      setVideoTitle(data.title || "Desi Saloon");
      setVideoId(data.video_id || null);
    } catch {
      // ignore
    }
  }

  function togglePlay() {
    if (!player) return;
    if (isPlaying) player.pauseVideo();
    else player.playVideo();
  }

  function handleSeek(e: React.MouseEvent<HTMLDivElement>) {
    if (!player || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = Math.min(Math.max((e.clientX - rect.left) / rect.width, 0), 1);
    player.seekTo(ratio * duration, true);
  }

  const thumbnail = videoId
    ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
    : null;


  const progress = duration ? (currentTime / duration) * 100 : 0;
  const artist = "Desi Saloon";

  return (
    <div className="glass-pill mx-auto flex w-full max-w-md items-center gap-3 rounded-full p-3 pr-4 animate-fade-in">
      <div className="relative h-16 w-16 flex-shrink-0 sm:h-20 sm:w-20">
        <div
          className={`h-full w-full rounded-full border-2 border-white/20 bg-black/20 object-cover ${
            isPlaying ? "animate-spin-slow" : "animate-spin-slow-paused"
          }`}
          style={
            thumbnail
              ? {
                  backgroundImage: `url(${thumbnail})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }
              : undefined
          }
        />

        <div className="absolute inset-0 m-auto h-4 w-4 rounded-full bg-white/90 shadow" />
      </div>

      <div className="flex flex-1 flex-col justify-center gap-0.5 overflow-hidden">
        <div className="truncate text-[15px] font-semibold leading-tight text-white text-shadow-sm">
          {videoTitle}
        </div>
        <div className="truncate text-[13px] text-white/70 text-shadow-sm">
          {artist}
        </div>
        <div
          className="mt-1 h-1 w-full cursor-pointer rounded-full bg-white/20"
          onClick={handleSeek}
          role="slider"
          aria-label="Progress"
          aria-valuemin={0}
          aria-valuemax={duration}
          aria-valuenow={currentTime}
        >
          <div
            className="progress-fill h-full rounded-full bg-white"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="mt-0.5 flex justify-between text-[11px] tabular-nums text-white/60 text-shadow-sm">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      <div className="flex items-center gap-1.5">
        <button
          onClick={() => player?.previousVideo()}
          className="glass-nav flex h-8 w-8 items-center justify-center rounded-full text-white transition hover:bg-white/20 hover:scale-105 active:scale-95"
          aria-label="Previous"
        >
          <SkipBack className="h-4 w-4 fill-current" />
        </button>
        <button
          onClick={togglePlay}
          className="glass-nav flex h-10 w-10 items-center justify-center rounded-full text-white transition hover:bg-white/20 hover:scale-105 active:scale-95"
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? (
            <Pause className="h-5 w-5 fill-current" />
          ) : (
            <Play className="h-5 w-5 fill-current" />
          )}
        </button>
        <button
          onClick={() => player?.nextVideo()}
          className="glass-nav flex h-8 w-8 items-center justify-center rounded-full text-white transition hover:bg-white/20 hover:scale-105 active:scale-95"
          aria-label="Next"
        >
          <SkipForward className="h-4 w-4 fill-current" />
        </button>
      </div>

      <div ref={containerRef} className="hidden" />
    </div>
  );
}

function formatTime(seconds: number) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}
