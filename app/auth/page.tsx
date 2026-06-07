"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type Mode = "signin" | "signup";
type AuthMethod = "google" | "email";

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z" fill="#4285F4"/>
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z" fill="#34A853"/>
      <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z" fill="#FBBC05"/>
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58Z" fill="#EA4335"/>
    </svg>
  );
}

export default function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState<AuthMethod | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  function resetState() {
    setError(null);
    setSuccess(null);
  }

  function switchMode(next: Mode) {
    setMode(next);
    resetState();
    setPassword("");
  }

  async function handleGoogle() {
    setLoading("google");
    resetState();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) setError(error.message);
    setLoading(null);
  }

  async function handleEmailAuth() {
    if (!email || !password) return;
    setLoading("email");
    resetState();

    if (mode === "signup") {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) {
        setError(error.message);
      } else {
        setSuccess("Check your email to confirm your account.");
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        setError(error.message);
      } else {
        router.push("/practice");
      }
    }

    setLoading(null);
  }

  const isLoading = loading !== null;
  const buttonLabel =
    loading === "email"
      ? mode === "signup"
        ? "Creating account…"
        : "Signing in…"
      : mode === "signup"
      ? "Create account"
      : "Sign in";

  return (
    <div
      className="flex min-h-screen items-center justify-center bg-[#0f1117] px-4"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      {/* Subtle background glow */}
      <div
        className="pointer-events-none fixed inset-0 opacity-30"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 50% 0%, #f9c74f22 0%, transparent 70%)",
        }}
      />

      <div className="relative w-full max-w-sm">
        {/* Logo */}
        <div className="mb-8 text-center">
          <div
            className="mb-1 text-3xl font-extrabold tracking-tight text-[#f9c74f]"
            style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
          >
            Revily
          </div>
          <div className="text-sm text-[#555a73]">
            {mode === "signin"
              ? "Welcome back. Keep your streak alive."
              : "Start your learning streak today."}
          </div>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-[#2e3248] bg-[#1a1d27] p-8">

          {/* Mode toggle */}
          <div className="mb-6 flex rounded-xl border border-[#2e3248] bg-[#22263a] p-1">
            {(["signin", "signup"] as Mode[]).map((m) => (
              <button
                key={m}
                onClick={() => switchMode(m)}
                disabled={isLoading}
                className={`flex-1 rounded-lg py-2 text-xs font-bold uppercase tracking-widest transition-all duration-200 ${
                  mode === m
                    ? "bg-[#f9c74f] text-[#0f1117]"
                    : "text-[#555a73] hover:text-[#8a8fa8]"
                }`}
                style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
              >
                {m === "signin" ? "Sign in" : "Sign up"}
              </button>
            ))}
          </div>

          {/* Google button */}
          <button
            onClick={handleGoogle}
            disabled={isLoading}
            className="mb-4 flex w-full items-center justify-center gap-3 rounded-xl border-2 border-[#2e3248] bg-[#22263a] px-4 py-3 text-sm font-semibold text-[#f1f0ee] transition-all hover:border-[#f1f0ee22] hover:bg-[#2a2f47] disabled:opacity-40"
          >
            {loading === "google" ? (
              <span className="text-[#8a8fa8]">Redirecting…</span>
            ) : (
              <>
                <GoogleIcon />
                Continue with Google
              </>
            )}
          </button>

          {/* Divider */}
          <div className="relative mb-4 flex items-center gap-3">
            <div className="h-px flex-1 bg-[#2e3248]" />
            <span className="text-xs text-[#555a73]">or</span>
            <div className="h-px flex-1 bg-[#2e3248]" />
          </div>

          {/* Email + password */}
          <div className="flex flex-col gap-3">
            <div>
              <label className="mb-1.5 block text-xs uppercase tracking-widest text-[#8a8fa8]">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                disabled={isLoading}
                className="w-full rounded-xl border-2 border-[#2e3248] bg-[#22263a] px-4 py-3 text-sm text-[#f1f0ee] outline-none placeholder:text-[#555a73] focus:border-[#f9c74f] transition-colors disabled:opacity-40"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs uppercase tracking-widest text-[#8a8fa8]">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleEmailAuth()}
                placeholder={mode === "signup" ? "Min. 6 characters" : "••••••••"}
                disabled={isLoading}
                className="w-full rounded-xl border-2 border-[#2e3248] bg-[#22263a] px-4 py-3 text-sm text-[#f1f0ee] outline-none placeholder:text-[#555a73] focus:border-[#f9c74f] transition-colors disabled:opacity-40"
              />
            </div>

            {/* Error */}
            {error && (
              <div className="rounded-xl border border-[#f87171] bg-[#1e0f0f] px-4 py-3 text-xs text-[#f87171]">
                {error}
              </div>
            )}

            {/* Success */}
            {success && (
              <div className="rounded-xl border border-[#4ade80] bg-[#0d1f15] px-4 py-3 text-xs text-[#4ade80]">
                {success}
              </div>
            )}

            <button
              onClick={handleEmailAuth}
              disabled={isLoading || !email || password.length < 6}
              className="w-full rounded-full bg-[#f9c74f] py-3 text-sm font-bold text-[#0f1117] transition-opacity hover:opacity-90 disabled:opacity-40"
              style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
            >
              {buttonLabel}
            </button>
          </div>
        </div>

        {/* Footer note */}
        <div className="mt-4 text-center text-xs text-[#555a73]">
          {mode === "signin" ? (
            <>
              No account?{" "}
              <button
                onClick={() => switchMode("signup")}
                className="text-[#f9c74f] hover:underline"
              >
                Sign up free
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                onClick={() => switchMode("signin")}
                className="text-[#f9c74f] hover:underline"
              >
                Sign in
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}