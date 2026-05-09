import { prisma } from "@backend/db/prisma";

type PrismaDelegate = {
  findMany(args?: unknown): Promise<unknown[]>;
  count(args?: unknown): Promise<number>;
  findUnique(args: unknown): Promise<unknown | null>;
  create(args: unknown): Promise<unknown>;
  update(args: unknown): Promise<unknown>;
  delete(args: unknown): Promise<unknown>;
};

export type RepositoryOptions = {
  model: keyof typeof prisma;
  searchable?: string[];
  include?: Record<string, unknown>;
};

export class BaseRepository {
  private delegate: PrismaDelegate;

  constructor(private options: RepositoryOptions) {
    this.delegate = prisma[options.model] as unknown as PrismaDelegate;
  }

  list(params: { page: number; limit: number; search?: string; sortBy?: string; sortDir?: "asc" | "desc" }) {
    const where =
      params.search && this.options.searchable?.length
        ? {
            OR: this.options.searchable.map((field) => ({
              [field]: { contains: params.search, mode: "insensitive" }
            }))
          }
        : undefined;

    return Promise.all([
      this.delegate.findMany({
        where,
        include: this.options.include,
        skip: (params.page - 1) * params.limit,
        take: params.limit,
        orderBy: params.sortBy ? { [params.sortBy]: params.sortDir ?? "asc" } : { createdAt: "desc" }
      }),
      this.delegate.count({ where })
    ]);
  }

  findById(id: string) {
    return this.delegate.findUnique({ where: { id }, include: this.options.include });
  }

  create(data: unknown) {
    return this.delegate.create({ data });
  }

  update(id: string, data: unknown) {
    return this.delegate.update({ where: { id }, data });
  }

  delete(id: string) {
    return this.delegate.delete({ where: { id } });
  }
}
