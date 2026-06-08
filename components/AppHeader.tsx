"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { JourneyMap } from "@/components/JourneyMap";

type Profile = {
  xp: number;
  streak: number;
};

const HIDDEN_ON = ["/auth", "/auth/callback"];

export function AppHeader() {
  const pathname = usePathname();
  const router = useRouter();

  const [mapOpen, setMapOpen] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [initials, setInitials] = useState<string>("");
  const [mounted, setMounted] = useState(false);

  async function loadProfile() {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.user) return;

    const name =
      session.user.user_metadata?.full_name || session.user.email || "";
    const parts = name.trim().split(" ");
    setInitials(
      parts.length >= 2
        ? `${parts[0][0]}${parts[1][0]}`.toUpperCase()
        : name.slice(0, 2).toUpperCase()
    );

    const { data } = await supabase
      .from("profiles")
      .select("xp, streak")
      .eq("user_id", session.user.id)
      .single();

    if (data) setProfile(data);
  }

  useEffect(() => {
    setMounted(true);
    loadProfile();

    // Re-fetch whenever practice awards XP
    window.addEventListener("revily:xp-updated", loadProfile);

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        setProfile(null);
        setInitials("");
      } else {
        loadProfile();
      }
    });

    return () => {
      subscription.unsubscribe();
      window.removeEventListener("revily:xp-updated", loadProfile);
    };
  }, []);

  if (!mounted || HIDDEN_ON.some((p) => pathname?.startsWith(p))) return null;
  if (!profile) return null;

  const level = Math.floor(profile.xp / 100) + 1;
  const xpIntoLevel = profile.xp % 100;

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/auth");
  }

  return (
    <>
      <header
        className="sticky top-0 z-50 w-full border-b border-[#2e3248]"
        style={{
          fontFamily: "'DM Sans', sans-serif",
          // Fix: Safari needs -webkit-backdrop-filter, and a solid fallback
          backgroundColor: "rgba(15, 17, 23, 0.92)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
        }}
      >
        <div className="mx-auto flex h-14 max-w-4xl items-center justify-between px-4">

          {/* Logo */}
          <button
            onClick={() => router.push("/")}
            className="text-xl font-extrabold tracking-tight text-[#f9c74f] transition-opacity hover:opacity-80"
            style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
          >
            Revily
          </button>

          {/* Stats + avatar */}
          <div className="flex items-center gap-2">

            {/* Map button — visible on all sizes now */}
            <div className="relative">
              <span
                className="absolute inset-0 rounded-full animate-ping"
                style={{
                  backgroundColor: "#f9c74f18",
                  animationDuration: "1.8s",
                }}
              />
              <span
                className="absolute inset-[-3px] rounded-full"
                style={{
                  border: "1.5px solid #f9c74f50",
                  animation: "mapRingPulse 1.8s ease-out infinite",
                }}
              />
              <button
                onClick={() => setMapOpen(true)}
                className="relative flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-all duration-200 hover:scale-105"
                style={{
                  backgroundColor: "#1a1d27",
                  border: "1.5px solid #f9c74f70",
                  color: "#f9c74f",
                  fontFamily: "'Bricolage Grotesque', sans-serif",
                }}
              >
                <span>🗺</span>
                {/* Hide "Map" label on very small screens to save space, keep icon */}
                <span className="hidden sm:inline">Map</span>
              </button>
              <style>{`
                @keyframes mapRingPulse {
                  0%   { transform: scale(1);    opacity: 0.6; }
                  70%  { transform: scale(1.35); opacity: 0;   }
                  100% { transform: scale(1.35); opacity: 0;   }
                }
              `}</style>
            </div>

            {/* XP */}
            <div className="flex items-center gap-1.5 rounded-full border border-[#2e3248] bg-[#1a1d27] px-3 py-1.5">
              <span className="text-xs text-[#f9c74f]">⚡</span>
              <span className="text-xs font-semibold text-[#f1f0ee]">
                {profile.xp} XP
              </span>
            </div>

            {/* Streak */}
            <div className="flex items-center gap-1.5 rounded-full border border-[#2e3248] bg-[#1a1d27] px-3 py-1.5">
              <span className="text-xs">🔥</span>
              <span className="text-xs font-semibold text-[#f1f0ee]">
                {profile.streak}
              </span>
            </div>

            {/* Level — desktop only */}
            <div className="hidden sm:flex items-center gap-1.5 rounded-full border border-[#2e3248] bg-[#1a1d27] px-3 py-1.5">
              <span className="text-xs font-semibold text-[#8a8fa8]">
                Lv.{level}
              </span>
              <div className="h-1.5 w-12 overflow-hidden rounded-full bg-[#2e3248]">
                <div
                  className="h-full rounded-full bg-[#f9c74f] transition-all duration-500"
                  style={{ width: `${xpIntoLevel}%` }}
                />
              </div>
            </div>

            {/* Avatar / sign out */}
            <button
              onClick={handleSignOut}
              title="Sign out"
              className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f9c74f] text-xs font-bold text-[#0f1117] transition-opacity hover:opacity-80"
              style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
            >
              {initials || "?"}
            </button>

          </div>
        </div>
      </header>
      <JourneyMap open={mapOpen} onClose={() => setMapOpen(false)} />
    </>
  );
}