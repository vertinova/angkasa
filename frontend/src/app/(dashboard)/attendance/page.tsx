import { ModuleManagement } from "@/components/data/module-management";
import { moduleConfigs } from "@/config/modules";

export default function AttendancePage() {
  return <ModuleManagement config={moduleConfigs.attendance} />;
}
