"use client";

import { Bell, Menu, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

type Notification = { id: string; title: string };

export function TopNavbar() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const source = new EventSource("/api/notifications/stream");
    source.addEventListener("notifications", (event) => {
      setNotifications(JSON.parse((event as MessageEvent).data));
    });
    return () => source.close();
  }, []);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b bg-background/88 px-4 backdrop-blur lg:pl-[16rem]">
      <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Buka menu">
        <Menu className="h-5 w-5" />
      </Button>
      <div className="relative hidden w-full max-w-md sm:block">
        <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input className="pl-9" placeholder="Cari siswa, guru, dokumen, invoice..." />
      </div>
      <div className="ml-auto flex items-center gap-2">
        <Button variant="outline" size="sm" className="relative">
          <Bell className="h-4 w-4" />
          <span className="hidden sm:inline">Notifikasi</span>
          {notifications.length > 0 ? <Badge className="absolute -right-2 -top-2 bg-accent text-accent-foreground">{notifications.length}</Badge> : null}
        </Button>
      </div>
    </header>
  );
}
