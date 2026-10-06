import { connection } from "next/server";
import { newRound } from "@/lib/game/round";
import { Game } from "./_components/Game";

export default async function Home() {
  // Deal a fresh round per request instead of baking one into the build.
  await connection();
  return <Game initialRound={newRound()} />;
}
