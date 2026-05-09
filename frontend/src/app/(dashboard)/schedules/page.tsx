import { FeatureBoard } from "@/components/data/feature-board";

export default function SchedulesPage() {
  return (
    <FeatureBoard
      title="Jadwal Pelajaran"
      description="Scheduler kelas dan guru dengan kalender akademik, notifikasi jadwal, dan fondasi drag-and-drop."
      features={["Jadwal kelas", "Jadwal guru", "Kalender akademik", "Drag and drop scheduler", "Notifikasi jadwal", "Validasi bentrok jam"]}
    />
  );
}
