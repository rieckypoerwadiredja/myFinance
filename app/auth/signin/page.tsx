"use client";

import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";

export default function SignInPage() {
  const searchParams = useSearchParams();
  const error = useMemo(() => searchParams.get("error"), [searchParams]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="w-full max-w-md rounded-lg bg-surface p-8 shadow-lg">
        <h1 className="mb-6 text-center text-3xl font-bold text-on-surface">
          Sign In
        </h1>
        {error && (
          <p className="mb-4 text-sm text-error">
            {error === "AccessDenied"
              ? "Email kamu tidak diizinkan."
              : "Gagal login. Coba lagi."}
          </p>
        )}
        <div className="space-y-3">
          <button
            type="button"
            onClick={() => signIn("google", { callbackUrl: "/" })}
            className="flex w-full font-semibold text-white justify-center rounded-md bg-primary px-4 py-2 text-sm text-on-primary shadow-sm hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            Continue with Google
          </button>
          <button
            type="button"
            onClick={() => signIn("github", { callbackUrl: "/" })}
            className="flex w-full font-semibold justify-center rounded-md bg-surface-container-low px-4 py-2 text-sm text-on-surface shadow-sm hover:bg-surface-high focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            Continue with GitHub
          </button>
        </div>
      </div>
    </div>
  );
}
