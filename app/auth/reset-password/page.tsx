"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type Step = "request" | "set-password" | "done";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("request");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // When Supabase redirects back with a recovery token,
  // it fires PASSWORD_RECOVERY — we move to the set-password step.
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event) => {
        if (event === "PASSWORD_RECOVERY") {
          setStep("set-password");
        }
      }
    );
    return () => subscription.unsubscribe();
  }, []);

  async function handleRequest() {
    if (!email) return;
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });
    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      setStep("done");
    }
  }

  async function handleSetPassword() {
    if (password.length < 6) return;
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      router.replace("/practice");
    }
  }

  return (
    <div
      className="flex min-h-screen items-center justify-center bg-[#0f1117] px-4"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      <div
        className="pointer-events-none fixed inset-0 opacity-30"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 50% 0%, #f9c74f22 0%, transparent 70%)",
        }}
      />

      <div className="relative w-full max-w-sm">
        <div className="mb-8 text-center">
          <div
            className="mb-1 text-3xl font-extrabold tracking-tight text-[#f9c74f]"
            style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
          >
            Revily
          </div>
          <div className="text-sm text-[#555a73]">
            {step === "request" && "Reset your password"}
            {step === "done" && "Check your inbox"}
            {step === "set-password" && "Choose a new password"}
          </div>
        </div>

        <div className="rounded-2xl border border-[#2e3248] bg-[#1a1d27] p-8">
          {step === "request" && (
            <div className="flex flex-col gap-3">
              <div>
                <label className="mb-1.5 block text-xs uppercase tracking-widest text-[#8a8fa8]">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleRequest()}
                  placeholder="you@example.com"
                  disabled={loading}
                  className="w-full rounded-xl border-2 border-[#2e3248] bg-[#22263a] px-4 py-3 text-sm text-[#f1f0ee] outline-none placeholder:text-[#555a73] focus:border-[#f9c74f] transition-colors disabled:opacity-40"
                />
              </div>
              {error && (
                <div className="rounded-xl border border-[#f87171] bg-[#1e0f0f] px-4 py-3 text-xs text-[#f87171]">
                  {error}
                </div>
              )}
              <button
                onClick={handleRequest}
                disabled={loading || !email}
                className="w-full rounded-full bg-[#f9c74f] py-3 text-sm font-bold text-[#0f1117] transition-opacity hover:opacity-90 disabled:opacity-40"
                style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
              >
                {loading ? "Sending…" : "Send reset link"}
              </button>
            </div>
          )}

          {step === "done" && (
            <p className="text-center text-sm text-[#8a8fa8]">
              We've sent a reset link to <span className="text-[#f1f0ee]">{email}</span>.
              Check your spam folder if it doesn't arrive.
            </p>
          )}

          {step === "set-password" && (
            <div className="flex flex-col gap-3">
              <div>
                <label className="mb-1.5 block text-xs uppercase tracking-widest text-[#8a8fa8]">
                  New password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSetPassword()}
                  placeholder="Min. 6 characters"
                  disabled={loading}
                  className="w-full rounded-xl border-2 border-[#2e3248] bg-[#22263a] px-4 py-3 text-sm text-[#f1f0ee] outline-none placeholder:text-[#555a73] focus:border-[#f9c74f] transition-colors disabled:opacity-40"
                />
              </div>
              {error && (
                <div className="rounded-xl border border-[#f87171] bg-[#1e0f0f] px-4 py-3 text-xs text-[#f87171]">
                  {error}
                </div>
              )}
              <button
                onClick={handleSetPassword}
                disabled={loading || password.length < 6}
                className="w-full rounded-full bg-[#f9c74f] py-3 text-sm font-bold text-[#0f1117] transition-opacity hover:opacity-90 disabled:opacity-40"
                style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
              >
                {loading ? "Updating…" : "Set new password"}
              </button>
            </div>
          )}
        </div>

        <div className="mt-4 text-center text-xs text-[#555a73]">
          <button
            onClick={() => router.push("/auth")}
            className="text-[#f9c74f] hover:underline"
          >
            Back to sign in
          </button>
        </div>
      </div>
    </div>
  );
}