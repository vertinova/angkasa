import { FeatureBoard } from "@/components/data/feature-board";

export default function ChatPage() {
  return (
    <FeatureBoard
      title="Chat & Komunikasi"
      description="Komunikasi real-time antara guru, siswa, orang tua, dan group kelas dengan attachment file."
      features={["Chat guru siswa", "Chat orang tua", "Group kelas", "Attachment file", "Realtime chat", "Moderasi percakapan"]}
    />
  );
}
