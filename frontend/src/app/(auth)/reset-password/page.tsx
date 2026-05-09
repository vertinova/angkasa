import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function ResetPasswordPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Reset Password</CardTitle>
          <CardDescription>Masukkan token dan password baru.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" action="/api/auth/reset-password" method="post">
            <div className="space-y-2">
              <Label>Token</Label>
              <Input name="token" />
            </div>
            <div className="space-y-2">
              <Label>Password Baru</Label>
              <Input name="password" type="password" />
            </div>
            <Button className="w-full">Reset Password</Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
