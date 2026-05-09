import { Prisma } from "@prisma/client";
import type { RepositoryOptions } from "@backend/repositories/base-repository";
import type { z } from "zod";
import type { AuthUser } from "@backend/auth/jwt";
import {
  announcementSchema,
  attendanceSchema,
  classSchema,
  documentSchema,
  gradeSchema,
  paymentSchema,
  studentSchema,
  teacherSchema
} from "@backend/validators/school";

type CrudConfigValue = RepositoryOptions & {
  module: string;
  schema: z.AnyZodObject;
  transformCreate?: (data: Record<string, unknown>, request: Request, user: AuthUser) => Record<string, unknown>;
  transformUpdate?: (data: Record<string, unknown>, request: Request, user: AuthUser) => Record<string, unknown>;
};

export const crudConfigs: Record<string, CrudConfigValue> = {
  students: {
    module: "students",
    model: "student",
    searchable: ["nis", "nisn", "fullName", "parentName"],
    include: { class: true },
    schema: studentSchema
  },
  teachers: {
    module: "teachers",
    model: "teacher",
    searchable: ["nip", "fullName", "certification"],
    include: { subjects: { include: { subject: true } } },
    schema: teacherSchema
  },
  classes: {
    module: "classes",
    model: "schoolClass",
    searchable: ["name", "major"],
    include: { homeroom: true, academicYear: true, _count: { select: { students: true } } },
    schema: classSchema
  },
  attendance: {
    module: "attendance",
    model: "attendance",
    searchable: [],
    include: { student: true },
    schema: attendanceSchema
  },
  academics: {
    module: "academics",
    model: "grade",
    searchable: ["semester"],
    include: { student: true, subject: true },
    schema: gradeSchema,
    transformCreate: (data: Record<string, unknown>) => {
      const assignment = Number(data.assignment ?? 0);
      const midterm = Number(data.midterm ?? 0);
      const final = Number(data.final ?? 0);
      const score = Math.round(assignment * 0.3 + midterm * 0.3 + final * 0.4);
      return {
        ...data,
        finalScore: new Prisma.Decimal(score),
        predicate: score >= 90 ? "A" : score >= 80 ? "B" : score >= 70 ? "C" : "D"
      };
    },
    transformUpdate: (data: Record<string, unknown>) => {
      const hasScoreParts = ["assignment", "midterm", "final"].some((key) => key in data);
      if (!hasScoreParts) return data;
      const assignment = Number(data.assignment ?? 0);
      const midterm = Number(data.midterm ?? 0);
      const final = Number(data.final ?? 0);
      const score = Math.round(assignment * 0.3 + midterm * 0.3 + final * 0.4);
      return {
        ...data,
        finalScore: new Prisma.Decimal(score),
        predicate: score >= 90 ? "A" : score >= 80 ? "B" : score >= 70 ? "C" : "D"
      };
    }
  },
  finance: {
    module: "finance",
    model: "payment",
    searchable: ["invoiceNo", "title", "method"],
    include: { student: true },
    schema: paymentSchema
  },
  announcements: {
    module: "announcements",
    model: "announcement",
    searchable: ["title", "content"],
    schema: announcementSchema
  },
  documents: {
    module: "documents",
    model: "document",
    searchable: ["title", "description"],
    include: { uploader: { select: { id: true, name: true, email: true } } },
    schema: documentSchema,
    transformCreate: (data: Record<string, unknown>, request, user) => ({
      ...data,
      uploadedBy: data.uploadedBy ?? request.headers.get("x-user-id") ?? user.id
    })
  }
};
