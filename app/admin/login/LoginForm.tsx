"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginForm() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function backToStart(message = "") {
    setStep(1);
    setCode("");
    setPassword("");
    setError(message);
  }

  // Step 1 — login + password.
  async function onCredentials(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (res.ok) {
        setStep(2);
        return;
      }
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      setError(data.error || "Login failed");
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  // Step 2 — the 2FA code.
  async function onCode(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      if (res.ok) {
        router.replace("/admin");
        router.refresh();
        return;
      }
      const data = (await res.json().catch(() => ({}))) as {
        error?: string;
        restart?: boolean;
      };
      if (data.restart) {
        backToStart(data.error || "Session expired, start again");
      } else {
        setError(data.error || "Verification failed");
      }
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  if (step === 1) {
    return (
      <form onSubmit={onCredentials}>
        <div className="login-steps">
          <span className="login-step is-active">1. Login</span>
          <span className="login-step">2. 2FA</span>
        </div>
        {error && <div className="login-error">{error}</div>}
        <div className="login-field">
          <label htmlFor="username">Login</label>
          <input
            id="username"
            type="text"
            autoComplete="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoFocus
          />
        </div>
        <div className="login-field">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button
          type="submit"
          className="btn btn-primary login-submit"
          disabled={loading || !username || !password}
        >
          {loading ? "Checking…" : "Continue"}
        </button>
      </form>
    );
  }

  return (
    <form onSubmit={onCode}>
      <div className="login-steps">
        <span className="login-step is-done">1. Login</span>
        <span className="login-step is-active">2. 2FA</span>
      </div>
      {error && <div className="login-error">{error}</div>}
      <div className="login-field">
        <label htmlFor="code">Authenticator code</label>
        <input
          id="code"
          className="login-code"
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={6}
          placeholder="000000"
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
          autoFocus
        />
      </div>
      <button
        type="submit"
        className="btn btn-primary login-submit"
        disabled={loading || code.length !== 6}
      >
        {loading ? "Signing in…" : "Sign in"}
      </button>
      <button
        type="button"
        className="login-back"
        onClick={() => backToStart()}
      >
        ← Back to login
      </button>
    </form>
  );
}
