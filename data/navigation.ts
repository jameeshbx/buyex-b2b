import Settings from "@/app/(protected)/staff/pages/settings/settings"

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
  senderDetails: {
    title: "Place an order",
    breadcrumbs: [
      { label: "Dashboards", href: "/dashboards" },
      { label: "Place an order", href: "/staff/dashboard/sender-details", current: true },
    ],
  },
  orderPreview: {
    title: "Order Preview",
    breadcrumbs: [
      { label: "Dashboards", href: "/dashboards" },
      { label: "Place an order", href: "/staff/dashboard/order-preview", current: true },
    ],
  },
   Settings: {
    title: "Order Preview",
    breadcrumbs: [
      { label: "Dashboards", href: "/dashboards" },
      { label: "Settings", href: "/staff/pages/settings", current: true },
    ],
  },
}
