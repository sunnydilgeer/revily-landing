"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    // createBrowserClient handles PKCE code exchange automatically.
    // We just listen for the resulting SIGNED_IN event and redirect.
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === "SIGNED_IN" && session) {
          subscription.unsubscribe();
          router.replace("/home");
        }
        // If something went wrong upstream, bail back to /auth
        if (event === "SIGNED_OUT") {
          router.replace("/auth");
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [router]);

  return (
    <div
      className="flex min-h-screen items-center justify-center bg-[#0f1117]"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      <div className="text-sm text-[#8a8fa8]">Signing you in…</div>
    </div>
  );
}