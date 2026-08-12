export type AudioSource = "our-playlist" | "my-youtube";

export const DEFAULT_SOURCE: AudioSource = "our-playlist";
export const MAX_USER_PLAYLISTS = 10;

const SOURCE_KEY = "audioSource";
const YT_LIST_KEY = "userYtPlaylists";
const YT_ACTIVE_KEY = "userYtActivePlaylist";

export interface UserPlaylist {
  id: string;
  name: string;
}

export function getStoredSource(): AudioSource {
  if (typeof window === "undefined") return DEFAULT_SOURCE;
  const v = window.localStorage.getItem(SOURCE_KEY);
  if (v === "my-youtube" || v === "our-playlist") return v;
  return DEFAULT_SOURCE;
}

export function storeSource(source: AudioSource) {
  try {
    window.localStorage.setItem(SOURCE_KEY, source);
  } catch {
    // ignore
  }
}

export function getStoredPlaylists(): UserPlaylist[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(YT_LIST_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as UserPlaylist[];
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((p) => p && typeof p.id === "string")
      .slice(0, MAX_USER_PLAYLISTS)
      .map((p) => ({ id: p.id, name: p.name || p.id }));
  } catch {
    return [];
  }
}

export function storePlaylists(playlists: UserPlaylist[]) {
  try {
    window.localStorage.setItem(
      YT_LIST_KEY,
      JSON.stringify(playlists.slice(0, MAX_USER_PLAYLISTS)),
    );
  } catch {
    // ignore
  }
}

export function getStoredActivePlaylist(): string {
  if (typeof window === "undefined") return "";
  return window.localStorage.getItem(YT_ACTIVE_KEY) || "";
}

export function storeActivePlaylist(id: string) {
  try {
    window.localStorage.setItem(YT_ACTIVE_KEY, id);
  } catch {
    // ignore
  }
}

/** Accepts a full YouTube URL or a raw playlist id. */
export function parsePlaylistId(input: string): string {
  const trimmed = input.trim();
  if (!trimmed) return "";
  const match = trimmed.match(/[?&]list=([^&\s]+)/);
  if (match?.[1]) return match[1];
  return trimmed;
}

export interface QueueTrack {
  id: string;
  title: string;
}

export async function fetchYoutubeTitle(videoId: string, fallback: string): Promise<string> {
  try {
    const res = await fetch(
      `https://www.youtube.com/oembed?url=${encodeURIComponent(
        `https://www.youtube.com/watch?v=${videoId}`,
      )}&format=json`,
    );
    if (!res.ok) return fallback;
    const json = (await res.json()) as { title?: string };
    return json.title || fallback;
  } catch {
    return fallback;
  }
}
