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
      { label: "Dashboard", href: "/dashboard" },
      { label: "View orders", href: "/dashboard/view-orders", current: true },
    ],
  },
  // Add more pages as needed
  orderDetails: {
    title: "Place an order",
    breadcrumbs: [
      { label: "Dashboards", href: "/dashboard" },
      { label: "Place an order", href: "/staff/dashboard/placeorder", current: true },
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
