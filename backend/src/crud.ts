import { NextRequest } from "next/server";
import type { z } from "zod";
import { BaseRepository, type RepositoryOptions } from "@backend/repositories/base-repository";
import { AppError, created, fail, ok } from "@backend/api";
import { getAuthUserFromRequest } from "@backend/auth/session";
import { requirePermission } from "@backend/auth/permissions";
import { sanitizePayload } from "@backend/sanitize";
import { writeAuditLog } from "@backend/services/audit-service";
import { rateLimit } from "@backend/rate-limit";

type CrudConfig = RepositoryOptions & {
  module: string;
  schema: z.AnyZodObject;
  transformCreate?: (data: Record<string, unknown>, request: NextRequest, user: NonNullable<Awaited<ReturnType<typeof getAuthUserFromRequest>>>) => Record<string, unknown>;
  transformUpdate?: (data: Record<string, unknown>, request: NextRequest, user: NonNullable<Awaited<ReturnType<typeof getAuthUserFromRequest>>>) => Record<string, unknown>;
};

function getPagination(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  return {
    page: Math.max(1, Number(searchParams.get("page") ?? 1)),
    limit: Math.min(100, Math.max(1, Number(searchParams.get("limit") ?? 10))),
    search: searchParams.get("search") ?? undefined,
    sortBy: searchParams.get("sortBy") ?? undefined,
    sortDir: searchParams.get("sortDir") === "desc" ? ("desc" as const) : ("asc" as const)
  };
}

export function createCrudHandlers(config: CrudConfig) {
  const repository = new BaseRepository(config);

  return {
    async GET(request: NextRequest) {
      try {
        rateLimit(request, config.module);
        const user = await getAuthUserFromRequest(request);
        requirePermission(user, config.module);
        const params = getPagination(request);
        const [items, total] = await repository.list(params);
        return ok({
          items,
          pagination: {
            page: params.page,
            limit: params.limit,
            total,
            totalPages: Math.ceil(total / params.limit)
          }
        });
      } catch (error) {
        return fail(error);
      }
    },

    async POST(request: NextRequest) {
      try {
        rateLimit(request, config.module);
        const user = await getAuthUserFromRequest(request);
        const actor = requirePermission(user, config.module);
        const payload = sanitizePayload(await request.json()) as Record<string, unknown>;
        const parsed = config.schema.parse(payload) as Record<string, unknown>;
        const data = config.transformCreate?.(parsed, request, actor) ?? parsed;
        const item = await repository.create(data);
        await writeAuditLog({ actor, action: "CREATE", entity: config.module, after: item });
        return created(item);
      } catch (error) {
        return fail(error);
      }
    }
  };
}

export function createCrudItemHandlers(config: CrudConfig) {
  const repository = new BaseRepository(config);

  return {
    async GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
      try {
        rateLimit(request, config.module);
        const user = await getAuthUserFromRequest(request);
        requirePermission(user, config.module);
        const { id } = await context.params;
        const item = await repository.findById(id);
        if (!item) throw new AppError("Data tidak ditemukan.", 404, "NOT_FOUND");
        return ok(item);
      } catch (error) {
        return fail(error);
      }
    },

    async PUT(request: NextRequest, context: { params: Promise<{ id: string }> }) {
      try {
        rateLimit(request, config.module);
        const user = await getAuthUserFromRequest(request);
        const actor = requirePermission(user, config.module);
        const { id } = await context.params;
        const before = await repository.findById(id);
        if (!before) throw new AppError("Data tidak ditemukan.", 404, "NOT_FOUND");
        const payload = sanitizePayload(await request.json()) as Record<string, unknown>;
        const parsed = config.schema.partial().parse(payload) as Record<string, unknown>;
        const data = config.transformUpdate?.(parsed, request, actor) ?? parsed;
        const item = await repository.update(id, data);
        await writeAuditLog({ actor, action: "UPDATE", entity: config.module, entityId: id, before, after: item });
        return ok(item);
      } catch (error) {
        return fail(error);
      }
    },

    async DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
      try {
        rateLimit(request, config.module);
        const user = await getAuthUserFromRequest(request);
        requirePermission(user, config.module);
        const { id } = await context.params;
        const before = await repository.findById(id);
        if (!before) throw new AppError("Data tidak ditemukan.", 404, "NOT_FOUND");
        await repository.delete(id);
        await writeAuditLog({ actor: user, action: "DELETE", entity: config.module, entityId: id, before });
        return ok({ id });
      } catch (error) {
        return fail(error);
      }
    }
  };
}
