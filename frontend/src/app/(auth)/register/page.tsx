import Link from "next/link";
import { RegisterForm } from "@/components/auth/register-form";

export default function RegisterPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <div className="w-full max-w-md space-y-4">
        <RegisterForm />
        <Link className="block text-center text-sm text-muted-foreground underline-offset-4 hover:underline" href="/login">
          Sudah punya akun? Masuk
        </Link>
      </div>
    </main>
  );
}
