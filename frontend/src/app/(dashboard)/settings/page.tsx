import { FeatureBoard } from "@/components/data/feature-board";

export default function SettingsPage() {
  return (
    <FeatureBoard
      title="Settings"
      description="Pengaturan sekolah, logo, tema, tahun ajaran, backup restore database, SMTP, dan API configuration."
      features={["Profil sekolah", "Logo sekolah", "Tema website", "Tahun ajaran", "Backup database", "Restore database", "SMTP email", "API configuration"]}
    />
  );
}
