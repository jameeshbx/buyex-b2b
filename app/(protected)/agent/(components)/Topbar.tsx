import Link from "next/link";
import type { PageData } from "@/data/agentNavigation";

interface TopbarProps {
  pageData?: PageData; // Make pageData optional
}

export function Topbar({ pageData }: TopbarProps) {
  // Provide default values if pageData or breadcrumbs is undefined
  const safePageData = pageData || {
    title: 'Dashboard',
    breadcrumbs: [
      { label: 'Dashboard', href: '/agent/dashboard', current: true }
    ]
  };

  return (
    <div className="w-full bg-off-white sticky top-0 z-40 right-0">
      <div className="mx-auto px-4 py-4">
        <nav className="flex flex-col space-y-2">
          {safePageData.breadcrumbs && safePageData.breadcrumbs.length > 0 && (
            <ol className="flex items-center space-x-2 text-sm font-medium text-gray-500">
              {safePageData.breadcrumbs.map((item, index) => (
                <li key={`${item.href}-${index}`} className="flex items-center">
                  {index > 0 && <span className="mx-2 text-gray-400">/</span>}
                  {item.current ? (
                    <span className="text-gray-700 font-jakarta">{item.label}</span>
                  ) : (
                    <Link 
                      href={item.href} 
                      className="hover:text-gray-700 hover:underline font-jakarta"
                    >
                      {item.label}
                    </Link>
                  )}
                </li>
              ))}
            </ol>
          )}
        </nav>
        <h1 className="mt-2 text-2xl font-semibold text-black md:text-3xl font-jakarta">
          {safePageData.title}
        </h1>
      </div>
    </div>
  );
}