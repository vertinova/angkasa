import Link from "next/link";
import { Suspense } from "react";
import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top_left,rgba(14,116,144,0.16),transparent_36%),radial-gradient(circle_at_bottom_right,rgba(245,158,11,0.15),transparent_32%)] p-4">
      <div className="grid w-full max-w-5xl items-center gap-8 lg:grid-cols-[1fr_430px]">
        <section className="space-y-5">
          <div className="inline-flex rounded-md border bg-background/80 px-3 py-1 text-sm font-medium text-muted-foreground">
            SD Angkasa 3
          </div>
          <h1 className="max-w-2xl text-4xl font-semibold tracking-normal md:text-5xl">
            Sistem informasi sekolah digital SD Angkasa 3.
          </h1>
          <p className="max-w-xl text-base text-muted-foreground">
            Kelola data siswa, guru, absensi, akademik, keuangan, dokumen, dan komunikasi sekolah dalam satu aplikasi.
          </p>
          <div className="flex gap-3 text-sm text-muted-foreground">
            <Link className="underline-offset-4 hover:underline" href="/register">
              Register
            </Link>
            <Link className="underline-offset-4 hover:underline" href="/forgot-password">
              Forgot password
            </Link>
          </div>
        </section>
        <Suspense>
          <LoginForm />
        </Suspense>
      </div>
    </main>
  );
}
