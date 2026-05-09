import { ModuleManagement } from "@/components/data/module-management";
import { moduleConfigs } from "@/config/modules";

export default function AnnouncementsPage() {
  return <ModuleManagement config={moduleConfigs.announcements} />;
}
