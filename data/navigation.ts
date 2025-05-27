export type BreadcrumbItem = {
  label: string
  href: string
  current?: boolean
}

export type PageData = {
  title: string
  breadcrumbs: BreadcrumbItem[]
}

export const pagesData: Record<string, PageData> = {
  orderDetails: {
    title: "Place an order",
    breadcrumbs: [
      { label: "Dashboard", href: "/dashboard" },
      { label: "Place an order", href: "/staff/dashboard/placeorder", current: true },
    ],
  },
  // Add more pages as needed
  senderDetails: {
    title: "Place an order",
    breadcrumbs: [
      { label: "Dashboards", href: "/dashboards" },
      { label: "Place an order", href: "/staff/dashboard/sender-details", current: true },
    ],
  },
  documentUpload: {
    title: "Place an order",
    breadcrumbs: [
      { label: "Dashboards", href: "/dashboards" },
      { label: "Place an order", href: "/staff/dashboard/document-upload", current: true },
    ],
  },
}