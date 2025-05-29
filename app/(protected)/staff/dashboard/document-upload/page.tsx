import DocumentUploadForm from "@/app/(protected)/staff/(components)/document-upload-form"
import { Topbar } from '../../(components)/Topbar'
import { pagesData } from "@/data/navigation"
import Menubar from "../../(components)/Menubar"

export default function Home() {
  return (
    <main className="container  mx-auto py-8 px-4">
      <Topbar pageData={pagesData.documentUpload} />
      <Menubar />
      <div className="p-4 bg-white">
        <DocumentUploadForm />
      </div>
    </main>
  )
}