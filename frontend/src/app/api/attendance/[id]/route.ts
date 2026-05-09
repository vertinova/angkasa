import { createCrudItemHandlers } from "@backend/crud";
import { crudConfigs } from "@backend/crud-configs";

export const runtime = "nodejs";
export const { GET, PUT, DELETE } = createCrudItemHandlers(crudConfigs.attendance);
