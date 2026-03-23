"use client";

import VantaBackground from "@/components/VantaBackground";
import VantaBackgroundOfBookMark from "@/components/VantaBackgroundOfBookMark";

export default function AuthVantaLayer({ isLoggedIn }: { isLoggedIn: boolean }) {
  
  return isLoggedIn ? (
    <VantaBackgroundOfBookMark key="logged-in" />
  ) : (
    <VantaBackground key="logged-out" />
  );
}
