import Link from "next/link"
import type { PageData } from "@/data/navigation"

interface TopbarProps {
  pageData?: PageData // Make pageData optional
}

export function Topbar({ pageData }: TopbarProps) {
  // Provide default values if pageData or breadcrumbs is undefined
  const safePageData = pageData || {
    title: '',
    breadcrumbs: []
  };

  return (
    <div className="w-full bg-off-white sticky top-0 z-40 right-0 fixed">
      <div className="mx-auto px-4 py-4">
        <nav className="flex" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2 text-base font-jakarta text-gray-400">
            {safePageData.breadcrumbs?.map((item, index) => (
              <li key={item.href} className="flex items-center">
                {index > 0 && <span className="mx-2 text-gray-400">/</span>}
                {item.current ? (
                  <span className="text-gray-700 font-jakarta">{item.label}</span>
                ) : (
                  <Link href={item.href} className="hover:text-gray-700 hover:underline font-jakarta">
                    {item.label}
                  </Link>
                )}
              </li>
            ))}
          </ol>
        </nav>
        <h1 className="mt-2 text-2xl font-semibold text-black md:text-3xl font-jakarta">
          {safePageData.title}
        </h1>
      </div>
    </div>
  )
}