import {
  Bell,
  BookOpen,
  CalendarDays,
  CreditCard,
  FileArchive,
  GraduationCap,
  LayoutDashboard,
  LibraryBig,
  MessageSquare,
  School,
  Settings,
  ShieldCheck,
  UserRoundCheck,
  UsersRound
} from "lucide-react";

export const navigation = [
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { title: "Siswa", href: "/students", icon: GraduationCap },
  { title: "Guru", href: "/teachers", icon: UserRoundCheck },
  { title: "Kelas", href: "/classes", icon: School },
  { title: "Absensi", href: "/attendance", icon: ShieldCheck },
  { title: "Akademik", href: "/academics", icon: BookOpen },
  { title: "Jadwal", href: "/schedules", icon: CalendarDays },
  { title: "Keuangan", href: "/finance", icon: CreditCard },
  { title: "E-Learning", href: "/elearning", icon: UsersRound },
  { title: "Perpustakaan", href: "/library", icon: LibraryBig },
  { title: "Pengumuman", href: "/announcements", icon: Bell },
  { title: "Chat", href: "/chat", icon: MessageSquare },
  { title: "Dokumen", href: "/documents", icon: FileArchive },
  { title: "Settings", href: "/settings", icon: Settings }
];
