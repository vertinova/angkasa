"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, UserPlus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiClient } from "@/lib/api-client";

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  role: z.string().default("SISWA")
});

type FormValues = z.infer<typeof schema>;

export function RegisterForm() {
  const [loading, setLoading] = useState(false);
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { role: "SISWA" }
  });

  async function onSubmit(values: FormValues) {
    setLoading(true);
    try {
      await apiClient("/api/auth/register", { method: "POST", body: JSON.stringify(values) });
      toast.success("Akun berhasil dibuat");
      form.reset();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Register gagal");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="glass-panel w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl">Daftar Akun</CardTitle>
        <CardDescription>Akun baru akan dibuat dengan role yang dipilih.</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="space-y-2">
            <Label>Nama</Label>
            <Input {...form.register("name")} />
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input type="email" {...form.register("email")} />
          </div>
          <div className="space-y-2">
            <Label>Password</Label>
            <Input type="password" {...form.register("password")} />
          </div>
          <div className="space-y-2">
            <Label>Role</Label>
            <select className="h-10 w-full rounded-md border bg-background px-3 text-sm" {...form.register("role")}>
              {["SISWA", "ORANG_TUA", "GURU", "WALI_KELAS", "STAFF", "ADMIN_SEKOLAH"].map((role) => (
                <option key={role} value={role}>
                  {role.replaceAll("_", " ")}
                </option>
              ))}
            </select>
          </div>
          <Button className="w-full" type="submit" disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserPlus className="h-4 w-4" />}
            Buat Akun
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
