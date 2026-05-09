import { ModuleManagement } from "@/components/data/module-management";
import { moduleConfigs } from "@/config/modules";

export default function ClassesPage() {
  return <ModuleManagement config={moduleConfigs.classes} />;
}
