import { z } from "zod";

export type FieldKind = "text" | "email" | "number" | "date" | "select" | "textarea" | "file";

export type ModuleField = {
  name: string;
  label: string;
  kind: FieldKind;
  placeholder?: string;
  options?: string[];
};

export type ModuleConfig = {
  key: string;
  title: string;
  description: string;
  endpoint: string;
  primaryField: string;
  fields: ModuleField[];
  columns: Array<{ key: string; header: string }>;
};

export const moduleConfigs: Record<string, ModuleConfig> = {
  students: {
    key: "students",
    title: "Management Data Siswa",
    description: "CRUD siswa, import/export, biodata, status, kelas, dan pencarian cepat.",
    endpoint: "/api/students",
    primaryField: "fullName",
    fields: [
      { name: "nis", label: "NIS", kind: "text" },
      { name: "nisn", label: "NISN", kind: "text" },
      { name: "fullName", label: "Nama Lengkap", kind: "text" },
      { name: "birthPlace", label: "Tempat Lahir", kind: "text" },
      { name: "birthDate", label: "Tanggal Lahir", kind: "date" },
      { name: "gender", label: "Jenis Kelamin", kind: "select", options: ["MALE", "FEMALE"] },
      { name: "religion", label: "Agama", kind: "text" },
      { name: "address", label: "Alamat", kind: "textarea" },
      { name: "parentName", label: "Nama Orang Tua", kind: "text" },
      { name: "parentContact", label: "Kontak Orang Tua", kind: "text" },
      { name: "major", label: "Jurusan", kind: "text" },
      { name: "status", label: "Status", kind: "select", options: ["ACTIVE", "INACTIVE", "GRADUATED", "MUTATION"] }
    ],
    columns: [
      { key: "nis", header: "NIS" },
      { key: "fullName", header: "Nama" },
      { key: "class.name", header: "Kelas" },
      { key: "major", header: "Jurusan" },
      { key: "status", header: "Status" }
    ]
  },
  teachers: {
    key: "teachers",
    title: "Management Guru",
    description: "Data guru, jadwal mengajar, sertifikasi, dokumen, absensi, dan performa.",
    endpoint: "/api/teachers",
    primaryField: "fullName",
    fields: [
      { name: "nip", label: "NIP", kind: "text" },
      { name: "fullName", label: "Nama Lengkap", kind: "text" },
      { name: "gender", label: "Jenis Kelamin", kind: "select", options: ["MALE", "FEMALE"] },
      { name: "phone", label: "Telepon", kind: "text" },
      { name: "address", label: "Alamat", kind: "textarea" },
      { name: "certification", label: "Sertifikasi", kind: "text" },
      { name: "employmentType", label: "Status Kepegawaian", kind: "text" }
    ],
    columns: [
      { key: "nip", header: "NIP" },
      { key: "fullName", header: "Nama" },
      { key: "employmentType", header: "Kepegawaian" },
      { key: "certification", header: "Sertifikasi" }
    ]
  },
  classes: {
    key: "classes",
    title: "Management Kelas",
    description: "Kelas, wali kelas, kapasitas, tahun ajaran, dan daftar siswa.",
    endpoint: "/api/classes",
    primaryField: "name",
    fields: [
      { name: "name", label: "Nama Kelas", kind: "text" },
      { name: "gradeLevel", label: "Tingkat", kind: "number" },
      { name: "major", label: "Jurusan", kind: "text" },
      { name: "capacity", label: "Kapasitas", kind: "number" },
      { name: "academicYearId", label: "ID Tahun Ajaran", kind: "text" }
    ],
    columns: [
      { key: "name", header: "Kelas" },
      { key: "gradeLevel", header: "Tingkat" },
      { key: "major", header: "Jurusan" },
      { key: "capacity", header: "Kapasitas" }
    ]
  },
  attendance: {
    key: "attendance",
    title: "Absensi Digital",
    description: "Absensi siswa/guru, QR attendance, rekap, statistik, dan export laporan.",
    endpoint: "/api/attendance",
    primaryField: "student.fullName",
    fields: [
      { name: "studentId", label: "ID Siswa", kind: "text" },
      { name: "date", label: "Tanggal", kind: "date" },
      { name: "status", label: "Status", kind: "select", options: ["PRESENT", "LATE", "SICK", "PERMIT", "ABSENT"] },
      { name: "note", label: "Catatan", kind: "textarea" },
      { name: "source", label: "Sumber", kind: "text" }
    ],
    columns: [
      { key: "student.fullName", header: "Siswa" },
      { key: "date", header: "Tanggal" },
      { key: "status", header: "Status" },
      { key: "source", header: "Sumber" }
    ]
  },
  academics: {
    key: "academics",
    title: "Akademik & Nilai",
    description: "Input nilai, raport digital, ranking, predikat otomatis, dan grafik perkembangan.",
    endpoint: "/api/grades",
    primaryField: "student.fullName",
    fields: [
      { name: "studentId", label: "ID Siswa", kind: "text" },
      { name: "subjectId", label: "ID Mapel", kind: "text" },
      { name: "semester", label: "Semester", kind: "text" },
      { name: "assignment", label: "Tugas", kind: "number" },
      { name: "midterm", label: "UTS", kind: "number" },
      { name: "final", label: "UAS", kind: "number" }
    ],
    columns: [
      { key: "student.fullName", header: "Siswa" },
      { key: "subject.name", header: "Mapel" },
      { key: "semester", header: "Semester" },
      { key: "finalScore", header: "Nilai Akhir" },
      { key: "predicate", header: "Predikat" }
    ]
  },
  finance: {
    key: "finance",
    title: "Pembayaran & Keuangan",
    description: "SPP, tagihan otomatis, invoice PDF, status pembayaran, dan dashboard keuangan.",
    endpoint: "/api/payments",
    primaryField: "invoiceNo",
    fields: [
      { name: "studentId", label: "ID Siswa", kind: "text" },
      { name: "invoiceNo", label: "Invoice", kind: "text" },
      { name: "title", label: "Judul", kind: "text" },
      { name: "amount", label: "Nominal", kind: "number" },
      { name: "paidAmount", label: "Terbayar", kind: "number" },
      { name: "dueDate", label: "Jatuh Tempo", kind: "date" },
      { name: "status", label: "Status", kind: "select", options: ["PAID", "UNPAID", "PARTIAL", "OVERDUE", "CANCELLED"] }
    ],
    columns: [
      { key: "invoiceNo", header: "Invoice" },
      { key: "student.fullName", header: "Siswa" },
      { key: "title", header: "Tagihan" },
      { key: "amount", header: "Nominal" },
      { key: "status", header: "Status" }
    ]
  },
  announcements: {
    key: "announcements",
    title: "Pengumuman & Notifikasi",
    description: "Broadcast, push/email notification, WhatsApp gateway placeholder, dan reminder.",
    endpoint: "/api/announcements",
    primaryField: "title",
    fields: [
      { name: "title", label: "Judul", kind: "text" },
      { name: "content", label: "Isi", kind: "textarea" },
      { name: "isPinned", label: "Pinned", kind: "select", options: ["true", "false"] }
    ],
    columns: [
      { key: "title", header: "Judul" },
      { key: "publishedAt", header: "Publikasi" },
      { key: "isPinned", header: "Pinned" }
    ]
  },
  documents: {
    key: "documents",
    title: "Dokumen Sekolah",
    description: "Arsip, upload file, kategori, pencarian, dan download center.",
    endpoint: "/api/documents",
    primaryField: "title",
    fields: [
      { name: "title", label: "Judul", kind: "text" },
      { name: "description", label: "Deskripsi", kind: "textarea" },
      { name: "category", label: "Kategori", kind: "select", options: ["ACADEMIC", "FINANCE", "STUDENT", "TEACHER", "SCHOOL", "LEGAL", "OTHER"] },
      { name: "fileUrl", label: "URL File", kind: "text" },
      { name: "fileType", label: "Tipe", kind: "text" },
      { name: "fileSize", label: "Ukuran", kind: "number" }
    ],
    columns: [
      { key: "title", header: "Judul" },
      { key: "category", header: "Kategori" },
      { key: "fileType", header: "Tipe" },
      { key: "createdAt", header: "Tanggal" }
    ]
  }
};

export const looseRecordSchema = z.record(z.unknown());
