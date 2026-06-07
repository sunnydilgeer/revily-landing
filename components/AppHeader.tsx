"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type Profile = {
  xp: number;
  streak: number;
};

const HIDDEN_ON = ["/auth", "/auth/callback"];

export function AppHeader() {
  const pathname = usePathname();
  const router = useRouter();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [initials, setInitials] = useState<string>("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    async function load() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user) return;

      // Derive initials from name or email
      const name =
        session.user.user_metadata?.full_name ||
        session.user.email ||
        "";
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

    load();

    // Keep header in sync when XP/streak updates during practice
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!session) {
          setProfile(null);
          setInitials("");
        } else {
          load();
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // Hide on auth pages
  if (!mounted || HIDDEN_ON.some((p) => pathname?.startsWith(p))) {
    return null;
  }

  // Don't show if not logged in
  if (!profile) return null;

  const level = Math.floor(profile.xp / 100) + 1;
  const xpIntoLevel = profile.xp % 100;

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/auth");
  }

  return (
    <header
      className="sticky top-0 z-50 w-full border-b border-[#2e3248] bg-[#0f1117]/90 backdrop-blur-md"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      <div className="mx-auto flex h-14 max-w-4xl items-center justify-between px-4">

        {/* Logo */}
        <button
          onClick={() => router.push("/")}
          className="text-xl font-extrabold tracking-tight text-[#f9c74f] transition-opacity hover:opacity-80"
          style={{ fontFamily: "'Syne', sans-serif" }}
        >
          Revily
        </button>

        {/* Stats + avatar */}
        <div className="flex items-center gap-2">

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

          {/* Level */}
          <div className="hidden sm:flex items-center gap-1.5 rounded-full border border-[#2e3248] bg-[#1a1d27] px-3 py-1.5">
            <span className="text-xs font-semibold text-[#8a8fa8]">
              Lv.{level}
            </span>
            {/* Mini XP bar */}
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
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            {initials || "?"}
          </button>

        </div>
      </div>
    </header>
  );
}