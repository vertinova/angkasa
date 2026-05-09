import { z } from "zod";

export const idSchema = z.object({ id: z.string().min(1) });

export const studentSchema = z.object({
  nis: z.string().min(2),
  nisn: z.string().min(4),
  fullName: z.string().min(2),
  birthPlace: z.string().min(2),
  birthDate: z.coerce.date(),
  gender: z.enum(["MALE", "FEMALE"]),
  religion: z.string().min(2),
  address: z.string().min(3),
  parentName: z.string().min(2),
  parentContact: z.string().min(4),
  photoUrl: z.string().optional().nullable(),
  classId: z.string().optional().nullable(),
  major: z.string().optional().nullable(),
  status: z.enum(["ACTIVE", "INACTIVE", "GRADUATED", "MUTATION"]).default("ACTIVE")
});

export const teacherSchema = z.object({
  nip: z.string().min(2),
  fullName: z.string().min(2),
  gender: z.enum(["MALE", "FEMALE"]),
  phone: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  certification: z.string().optional().nullable(),
  employmentType: z.string().default("Tetap")
});

export const classSchema = z.object({
  name: z.string().min(2),
  gradeLevel: z.coerce.number().int().min(1),
  major: z.string().optional().nullable(),
  capacity: z.coerce.number().int().min(1),
  academicYearId: z.string().min(1),
  homeroomId: z.string().optional().nullable()
});

export const attendanceSchema = z.object({
  studentId: z.string().min(1),
  date: z.coerce.date(),
  status: z.enum(["PRESENT", "LATE", "SICK", "PERMIT", "ABSENT"]),
  note: z.string().optional().nullable(),
  source: z.string().default("manual"),
  qrToken: z.string().optional().nullable()
});

export const gradeSchema = z.object({
  studentId: z.string().min(1),
  subjectId: z.string().min(1),
  semester: z.string().min(1),
  assignment: z.coerce.number().min(0).max(100),
  midterm: z.coerce.number().min(0).max(100),
  final: z.coerce.number().min(0).max(100)
});

export const paymentSchema = z.object({
  studentId: z.string().min(1),
  invoiceNo: z.string().min(3),
  title: z.string().min(2),
  amount: z.coerce.number().min(0),
  paidAmount: z.coerce.number().min(0).default(0),
  dueDate: z.coerce.date(),
  paidAt: z.coerce.date().optional().nullable(),
  status: z.enum(["PAID", "UNPAID", "PARTIAL", "OVERDUE", "CANCELLED"]).default("UNPAID"),
  method: z.string().optional().nullable()
});

export const announcementSchema = z.object({
  title: z.string().min(2),
  content: z.string().min(3),
  audience: z.array(z.enum(["SUPER_ADMIN", "ADMIN_SEKOLAH", "KEPALA_SEKOLAH", "GURU", "WALI_KELAS", "SISWA", "ORANG_TUA", "STAFF"])).default(["SISWA"]),
  isPinned: z.coerce.boolean().default(false)
});

export const documentSchema = z.object({
  title: z.string().min(2),
  description: z.string().optional().nullable(),
  category: z.enum(["ACADEMIC", "FINANCE", "STUDENT", "TEACHER", "SCHOOL", "LEGAL", "OTHER"]).default("OTHER"),
  fileUrl: z.string().min(1),
  fileType: z.string().min(1),
  fileSize: z.coerce.number().int().min(0),
  uploadedBy: z.string().optional()
});
