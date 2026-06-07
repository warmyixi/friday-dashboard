import { Suspense } from "react";

import { LoginForm } from "@/components/LoginForm";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-friday-bg px-4">
      <Suspense
        fallback={
          <div className="w-full max-w-sm rounded-2xl border border-friday-border-subtle bg-friday-panel p-6 text-center text-sm text-friday-muted shadow-card">
            載入中…
          </div>
        }
      >
        <LoginForm />
      </Suspense>
    </div>
  );
}
