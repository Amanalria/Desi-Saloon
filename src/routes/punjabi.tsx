import { createFileRoute } from "@tanstack/react-router";
import { PlayerPage } from "../components/PlayerPage";

export const Route = createFileRoute("/punjabi")({
  head: () => ({
    meta: [
      { title: "पंजाबी गाने | देसी सैलून" },
      { name: "description", content: "Punjabi classics playing at Desi Saloon." },
      { property: "og:title", content: "पंजाबी गाने | देसी सैलून" },
      { property: "og:description", content: "Punjabi classics playing at Desi Saloon." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Punjabi,
});

function Punjabi() {
  return (
    <PlayerPage playlistName="पंजाबी गाने" playlistId="PLT41frwtG63E" />
  );
}
