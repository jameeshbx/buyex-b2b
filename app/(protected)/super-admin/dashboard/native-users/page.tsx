import { pagesData } from "@/data/navigation"
import { Topbar } from "../../(components)/Topbar"
import UserManagement from "./user-managemnet"

export default function Home() {
  return (
    <div>
        <div className="sticky top-0 z-40">
            <Topbar pageData={pagesData.nativeUsers} />
        </div>
         <main className="min-h-screen bg-gray-50 p-4 md:p-8">
            <UserManagement />
        </main>
    </div>
  )
}
