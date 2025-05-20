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
  customers: {
    title: "Customers",
    breadcrumbs: [
      { label: "Dashboards", href: "/dashboards" },
      { label: "Customers", href: "/dashboards/customers", current: true },
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
