import { ModuleManagement } from "@/components/data/module-management";
import { moduleConfigs } from "@/config/modules";

export default function AcademicsPage() {
  return <ModuleManagement config={moduleConfigs.academics} />;
}
