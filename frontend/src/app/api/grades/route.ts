import { createCrudHandlers } from "@backend/crud";
import { crudConfigs } from "@backend/crud-configs";

export const runtime = "nodejs";
export const { GET, POST } = createCrudHandlers(crudConfigs.academics);
