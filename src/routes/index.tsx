import { createFileRoute } from "@tanstack/react-router";
import { RuneDesktop } from "@/components/rune/RuneDesktop";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Rune OS · AI-native Desktop" },
      { name: "description", content: "Rune OS — a futuristic AI-native desktop operating system. Living orb assistant, ambient orchestration, A.D.A.M security." },
    ],
  }),
});

function Index() {
  return <RuneDesktop />;
}
