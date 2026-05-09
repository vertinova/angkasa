import { FeatureBoard } from "@/components/data/feature-board";

export default function LibraryPage() {
  return (
    <FeatureBoard
      title="Perpustakaan Digital"
      description="Management buku, peminjaman, pengembalian, denda otomatis, barcode scanner, dan ebook viewer."
      features={["Management buku", "Peminjaman", "Pengembalian", "Denda otomatis", "Barcode scanner", "Ebook viewer"]}
    />
  );
}
