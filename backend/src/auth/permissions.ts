import { Role } from "@prisma/client";
import { AppError } from "../api";
import type { AuthUser } from "./jwt";

const allRoles = Object.values(Role);

export const permissions: Record<string, Role[]> = {
  dashboard: allRoles,
  students: [Role.SUPER_ADMIN, Role.ADMIN_SEKOLAH, Role.KEPALA_SEKOLAH, Role.GURU, Role.WALI_KELAS, Role.STAFF],
  teachers: [Role.SUPER_ADMIN, Role.ADMIN_SEKOLAH, Role.KEPALA_SEKOLAH, Role.STAFF],
  classes: [Role.SUPER_ADMIN, Role.ADMIN_SEKOLAH, Role.KEPALA_SEKOLAH, Role.WALI_KELAS, Role.STAFF],
  attendance: [Role.SUPER_ADMIN, Role.ADMIN_SEKOLAH, Role.KEPALA_SEKOLAH, Role.GURU, Role.WALI_KELAS, Role.STAFF],
  academics: [Role.SUPER_ADMIN, Role.ADMIN_SEKOLAH, Role.KEPALA_SEKOLAH, Role.GURU, Role.WALI_KELAS],
  finance: [Role.SUPER_ADMIN, Role.ADMIN_SEKOLAH, Role.KEPALA_SEKOLAH, Role.STAFF],
  elearning: [Role.SUPER_ADMIN, Role.ADMIN_SEKOLAH, Role.GURU, Role.WALI_KELAS, Role.SISWA],
  library: [Role.SUPER_ADMIN, Role.ADMIN_SEKOLAH, Role.STAFF, Role.GURU, Role.SISWA],
  announcements: [Role.SUPER_ADMIN, Role.ADMIN_SEKOLAH, Role.KEPALA_SEKOLAH, Role.STAFF],
  chat: allRoles,
  documents: [Role.SUPER_ADMIN, Role.ADMIN_SEKOLAH, Role.KEPALA_SEKOLAH, Role.GURU, Role.WALI_KELAS, Role.STAFF],
  settings: [Role.SUPER_ADMIN, Role.ADMIN_SEKOLAH]
};

export function can(user: AuthUser, module: string) {
  return permissions[module]?.includes(user.role) ?? false;
}

export function requirePermission(user: AuthUser | null, module: string) {
  if (!user) {
    throw new AppError("Authentication required", 401, "UNAUTHENTICATED");
  }

  if (!can(user, module)) {
    throw new AppError("Anda tidak memiliki akses ke modul ini.", 403, "FORBIDDEN");
  }

  return user;
}
