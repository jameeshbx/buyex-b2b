import { pagesData } from "@/data/navigation";
import { Topbar } from "../../(components)/Topbar";
import OrganisationManagement from "./organisation-management";

export default function OrganisationPage() {
  return (
    <div>
      <div className="sticky top-0 z-40">
        <Topbar pageData={pagesData.organisations} />
      </div>
      <main className="min-h-screen bg-gray-50 p-4 md:p-8">
        <OrganisationManagement />
      </main>
    </div>
  );
}
