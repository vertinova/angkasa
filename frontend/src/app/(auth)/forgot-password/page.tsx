import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function ForgotPasswordPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Forgot Password</CardTitle>
          <CardDescription>Masukkan email untuk menerima instruksi reset.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" action="/api/auth/forgot-password" method="post">
            <div className="space-y-2">
              <Label>Email</Label>
              <Input name="email" type="email" />
            </div>
            <Button className="w-full">Kirim Instruksi</Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
