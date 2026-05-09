import { FeatureBoard } from "@/components/data/feature-board";

export default function ElearningPage() {
  return (
    <FeatureBoard
      title="E-Learning"
      description="Ruang belajar digital untuk materi, video, tugas online, quiz, CBT, diskusi, dan submission siswa."
      features={["Upload materi", "Video pembelajaran", "Tugas online", "Quiz online", "CBT exam", "Diskusi kelas", "Auto grading", "Submission siswa"]}
    />
  );
}
