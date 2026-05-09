import { ModuleManagement } from "@/components/data/module-management";
import { moduleConfigs } from "@/config/modules";

export default function StudentsPage() {
  return <ModuleManagement config={moduleConfigs.students} />;
}
