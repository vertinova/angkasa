"use client";

import { CalendarDays, CreditCard, GraduationCap, School, UserRoundCheck, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { apiClient } from "@/lib/api-client";
import { formatCurrency } from "@/lib/utils";

type DashboardData = {
  cards: { students: number; teachers: number; classes: number; revenue: number };
  attendance: Array<{ name: string; value: number }>;
  announcements: Array<{ id: string; title: string; content: string; isPinned: boolean }>;
  schedules: Array<{ id: string; startsAt: string; endsAt: string; class: { name: string }; subject: { name: string }; teacher: { fullName: string } }>;
  activities: Array<{ id: string; action: string; module: string; createdAt: string; user: { name: string } }>;
};

const trend = [
  { month: "Jan", hadir: 92, nilai: 78 },
  { month: "Feb", hadir: 94, nilai: 81 },
  { month: "Mar", hadir: 91, nilai: 83 },
  { month: "Apr", hadir: 96, nilai: 86 },
  { month: "Mei", hadir: 95, nilai: 88 }
];

export function DashboardClient() {
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    apiClient<DashboardData>("/api/dashboard/stats").then(setData).catch(() => {
      setData({
        cards: { students: 0, teachers: 0, classes: 0, revenue: 0 },
        attendance: [],
        announcements: [],
        schedules: [],
        activities: []
      });
    });
  }, []);

  const cards = [
    { label: "Siswa Aktif", value: data?.cards.students ?? 0, icon: GraduationCap },
    { label: "Guru", value: data?.cards.teachers ?? 0, icon: UserRoundCheck },
    { label: "Kelas", value: data?.cards.classes ?? 0, icon: School },
    { label: "Pemasukan", value: formatCurrency(data?.cards.revenue ?? 0), icon: CreditCard }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <Badge>SD Angkasa 3</Badge>
          <h1 className="mt-3 text-3xl font-semibold tracking-normal">Dashboard Sekolah</h1>
          <p className="mt-1 text-muted-foreground">Ringkasan operasional akademik, absensi, keuangan, dan aktivitas terbaru.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline">
            <CalendarDays className="h-4 w-4" />
            Kalender Akademik
          </Button>
          <Button>
            <Zap className="h-4 w-4" />
            Quick Action
          </Button>
        </div>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Card key={card.label}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardDescription>{card.label}</CardDescription>
                <Icon className="h-5 w-5 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold">{card.value}</div>
                <p className="mt-1 text-xs text-muted-foreground">Update otomatis dari database</p>
              </CardContent>
            </Card>
          );
        })}
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.3fr_0.7fr]">
        <Card>
          <CardHeader>
            <CardTitle>Grafik Kehadiran & Akademik</CardTitle>
            <CardDescription>Perkembangan bulanan siswa secara agregat.</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trend}>
                <defs>
                  <linearGradient id="hadir" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="5%" stopColor="#0f766e" stopOpacity={0.45} />
                    <stop offset="95%" stopColor="#0f766e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="hadir" stroke="#0f766e" fill="url(#hadir)" />
                <Area type="monotone" dataKey="nilai" stroke="#f59e0b" fill="#f59e0b33" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Rekap Absensi</CardTitle>
            <CardDescription>Distribusi status kehadiran.</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.attendance ?? []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="value" fill="#0f766e" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Pengumuman Sekolah</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {(data?.announcements ?? []).map((item) => (
              <div key={item.id} className="rounded-md border p-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-medium">{item.title}</p>
                  {item.isPinned ? <Badge>Pinned</Badge> : null}
                </div>
                <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{item.content}</p>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Jadwal Hari Ini</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {(data?.schedules ?? []).map((item) => (
              <div key={item.id} className="flex items-center justify-between rounded-md border p-3">
                <div>
                  <p className="font-medium">{item.subject.name}</p>
                  <p className="text-sm text-muted-foreground">{item.class.name} - {item.teacher.fullName}</p>
                </div>
                <Badge>{item.startsAt}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Aktivitas Terbaru</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {(data?.activities ?? []).map((item) => (
              <div key={item.id} className="rounded-md border p-3">
                <p className="font-medium">{item.user.name}</p>
                <p className="text-sm text-muted-foreground">{item.action} di modul {item.module}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
