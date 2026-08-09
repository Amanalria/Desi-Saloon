import { createFileRoute } from "@tanstack/react-router";
import { PlayerPage } from "../components/PlayerPage";

export const Route = createFileRoute("/anuv")({
  head: () => ({
    meta: [
      { title: "अनुव जैन | देसी सैलून" },
      { name: "description", content: "Anuv Jain indie gems playing at Desi Saloon." },
      { property: "og:title", content: "अनुव जैन | देसी सैलून" },
      { property: "og:description", content: "Anuv Jain indie gems playing at Desi Saloon." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Anuv,
});

function Anuv() {
  return <PlayerPage playlistName="अनुव जैन" playlistId="PLZfD4VXbKPMA" />;
}
