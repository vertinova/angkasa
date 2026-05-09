import { PrismaClient, Role, Gender, StudentStatus, AttendanceStatus, PaymentStatus } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await hash("password", 12);

  const users = await Promise.all(
    [
      ["Super Admin", "superadmin", "superadmin@angkasa.vertinova.id", Role.SUPER_ADMIN],
      ["Admin SD Angkasa 3", "admin", "admin@angkasa.vertinova.id", Role.ADMIN_SEKOLAH],
      ["Kepala SD Angkasa 3", "kepsek", "kepsek@angkasa.vertinova.id", Role.KEPALA_SEKOLAH],
      ["Bu Ratna Guru", "guru", "guru@angkasa.vertinova.id", Role.GURU],
      ["Pak Bima Wali Kelas", "walikelas", "walikelas@angkasa.vertinova.id", Role.WALI_KELAS],
      ["Siswa Demo", "siswa", "siswa@angkasa.vertinova.id", Role.SISWA],
      ["Orang Tua Demo", "ortu", "ortu@angkasa.vertinova.id", Role.ORANG_TUA],
      ["Staff TU", "staff", "staff@angkasa.vertinova.id", Role.STAFF]
    ].map(([name, username, email, role]) =>
      prisma.user.upsert({
        where: { email: String(email) },
        update: { name: String(name), username: String(username), role: role as Role, passwordHash },
        create: { name: String(name), username: String(username), email: String(email), role: role as Role, passwordHash }
      })
    )
  );

  const academicYear = await prisma.academicYear.upsert({
    where: { name: "2026/2027" },
    update: { isActive: true },
    create: {
      name: "2026/2027",
      startsAt: new Date("2026-07-01"),
      endsAt: new Date("2027-06-30"),
      isActive: true
    }
  });

  const math = await prisma.subject.upsert({
    where: { code: "MTK" },
    update: {},
    create: { code: "MTK", name: "Matematika", kkm: 78, description: "Matematika wajib" }
  });

  const indo = await prisma.subject.upsert({
    where: { code: "BIN" },
    update: {},
    create: { code: "BIN", name: "Bahasa Indonesia", kkm: 75 }
  });

  const teacher = await prisma.teacher.upsert({
    where: { nip: "198801012026011001" },
    update: {},
    create: {
      userId: users[3].id,
      nip: "198801012026011001",
      fullName: "Ratna Anggraini, S.Pd.",
      gender: Gender.FEMALE,
      phone: "081234567890",
      address: "Jl. Pendidikan No. 1",
      certification: "Pendidik Profesional",
      performanceRate: 94.5
    }
  });

  await prisma.teacherSubject.createMany({
    data: [
      { teacherId: teacher.id, subjectId: math.id },
      { teacherId: teacher.id, subjectId: indo.id }
    ],
    skipDuplicates: true
  });

  const classX = await prisma.schoolClass.upsert({
    where: { name_academicYearId: { name: "X IPA 1", academicYearId: academicYear.id } },
    update: {},
    create: {
      name: "X IPA 1",
      gradeLevel: 10,
      major: "IPA",
      capacity: 36,
      academicYearId: academicYear.id,
      homeroomId: teacher.id
    }
  });

  const student = await prisma.student.upsert({
    where: { nis: "260001" },
    update: {},
    create: {
      userId: users[5].id,
      nis: "260001",
      nisn: "0061234567",
      fullName: "Alya Putri Ramadhani",
      birthPlace: "Bandung",
      birthDate: new Date("2011-04-12"),
      gender: Gender.FEMALE,
      religion: "Islam",
      address: "Jl. Merdeka No. 10",
      parentName: "Rudi Hermawan",
      parentContact: "081298765432",
      major: "IPA",
      status: StudentStatus.ACTIVE,
      classId: classX.id
    }
  });

  const parent = await prisma.parent.upsert({
    where: { userId: users[6].id },
    update: {},
    create: {
      userId: users[6].id,
      name: "Rudi Hermawan",
      phone: "081298765432",
      address: "Jl. Merdeka No. 10",
      job: "Wiraswasta"
    }
  });

  await prisma.parentStudent.upsert({
    where: { parentId_studentId: { parentId: parent.id, studentId: student.id } },
    update: {},
    create: { parentId: parent.id, studentId: student.id, relation: "Ayah" }
  });

  await prisma.schedule.createMany({
    data: [
      { classId: classX.id, teacherId: teacher.id, subjectId: math.id, dayOfWeek: 1, startsAt: "07:30", endsAt: "09:00", room: "R-101" },
      { classId: classX.id, teacherId: teacher.id, subjectId: indo.id, dayOfWeek: 2, startsAt: "09:15", endsAt: "10:45", room: "R-101" }
    ],
    skipDuplicates: true
  });

  await prisma.attendance.createMany({
    data: [
      { studentId: student.id, date: new Date("2026-05-10"), status: AttendanceStatus.PRESENT, source: "qr" },
      { studentId: student.id, date: new Date("2026-05-09"), status: AttendanceStatus.LATE, note: "Terlambat 8 menit" }
    ],
    skipDuplicates: true
  });

  await prisma.grade.upsert({
    where: { studentId_subjectId_semester: { studentId: student.id, subjectId: math.id, semester: "Ganjil" } },
    update: {},
    create: {
      studentId: student.id,
      subjectId: math.id,
      semester: "Ganjil",
      assignment: 88,
      midterm: 91,
      final: 90,
      finalScore: 90,
      predicate: "A",
      rank: 1
    }
  });

  await prisma.payment.upsert({
    where: { invoiceNo: "INV-2026-0001" },
    update: {},
    create: {
      studentId: student.id,
      invoiceNo: "INV-2026-0001",
      title: "SPP Mei 2026",
      amount: 450000,
      paidAmount: 450000,
      dueDate: new Date("2026-05-15"),
      paidAt: new Date("2026-05-03"),
      status: PaymentStatus.PAID,
      method: "Transfer Bank"
    }
  });

  await prisma.announcement.createMany({
    data: [
      {
        title: "Ujian Akhir Semester",
        content: "UAS dimulai 3 Juni 2026. Jadwal lengkap tersedia di dashboard akademik.",
        audience: [Role.SISWA, Role.ORANG_TUA, Role.GURU],
        isPinned: true
      },
      {
        title: "Rapat Komite Sekolah",
        content: "Rapat komite dilaksanakan Jumat pukul 13.00 WIB di aula utama.",
        audience: [Role.ORANG_TUA, Role.ADMIN_SEKOLAH, Role.KEPALA_SEKOLAH]
      }
    ],
    skipDuplicates: true
  });

  await prisma.book.createMany({
    data: [
      { isbn: "9786020324784", title: "Dasar-Dasar Sains", author: "Tim Akademik", publisher: "School Press", category: "Sains", stock: 12, available: 11, barcode: "BK-0001" },
      { isbn: "9786020324785", title: "Literasi Digital", author: "Maya Saraswati", publisher: "School Press", category: "Teknologi", stock: 8, available: 8, barcode: "BK-0002" }
    ],
    skipDuplicates: true
  });

  await prisma.schoolSetting.createMany({
    data: [
      {
        schoolName: "SD Angkasa 3",
        address: "Kompleks Lanud, Indonesia",
        phone: "021-555-0199",
        email: "admin@angkasa.vertinova.id",
        website: "https://angkasa.vertinova.id",
        theme: "system"
      }
    ],
    skipDuplicates: true
  });

  console.log("Seed completed. Login with username admin / password");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
