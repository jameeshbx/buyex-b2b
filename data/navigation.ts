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
  viewOrders: {
    title: "View orders",
    breadcrumbs: [
      { label: "Dashboards", href: "/dashboards" },
      { label: "View orders", href: "/dashboards/view-orders", current: true },
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
  products: {
    title: "Products",
    breadcrumbs: [
      { label: "Dashboards", href: "/dashboards" },
      { label: "Products", href: "/dashboards/products", current: true },
    ],
  },
}
