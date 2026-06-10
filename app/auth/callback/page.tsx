"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === "SIGNED_IN" && session) {
          subscription.unsubscribe();
          router.replace("/home");
        }
        if (event === "PASSWORD_RECOVERY") {
          subscription.unsubscribe();
          router.replace("/auth/reset-password");
        }
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