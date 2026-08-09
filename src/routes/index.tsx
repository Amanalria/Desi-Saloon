import { createFileRoute } from "@tanstack/react-router";
import { PlayerPage } from "../components/PlayerPage";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "पुराने गाने | देसी सैलून" },
      { name: "description", content: "Old Bollywood classics playing at Desi Saloon." },
      { property: "og:title", content: "पुराने गाने | देसी सैलून" },
      { property: "og:description", content: "Old Bollywood classics playing at Desi Saloon." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <PlayerPage playlistName="पुराने गाने" playlistId="PLAI9mVohmMrk" />
  );
}
