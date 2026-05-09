import { prisma } from "@backend/db/prisma";
import type { AuthUser } from "@backend/auth/jwt";

export async function writeAuditLog(input: {
  actor?: AuthUser | null;
  action: string;
  entity: string;
  entityId?: string;
  before?: unknown;
  after?: unknown;
}) {
  await prisma.auditLog.create({
    data: {
      actorId: input.actor?.id,
      action: input.action,
      entity: input.entity,
      entityId: input.entityId,
      before: input.before as object | undefined,
      after: input.after as object | undefined
    }
  });
}
