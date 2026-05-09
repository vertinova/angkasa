import { ModuleManagement } from "@/components/data/module-management";
import { moduleConfigs } from "@/config/modules";

export default function TeachersPage() {
  return <ModuleManagement config={moduleConfigs.teachers} />;
}
