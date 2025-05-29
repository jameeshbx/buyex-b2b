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
      { label: "Dashboards", href: "/staff/dashboard" },
      { label: "View orders", href: "/dashboards/view-orders", current: true },
    ],
  },
  newBeneficiary: {
    title: "Place an order",
    breadcrumbs: [
      { label: "Dashboards", href: "/staff/dashboard" },
      { label: "Place an order", href: "/staff/dashboard/beneficiary-details", current: true },
    ],
  },
  senderDetails: {
    title: "Place an order",
    breadcrumbs: [
      { label: "Dashboards", href: "/staff/dashboard" },
      { label: "Place an order", href: "/staff/dashboard/sender-details", current: true },
    ],
  },
  placeOrder: {
    title: "Place an order",
    breadcrumbs: [
      { label: "Dashboards", href: "/staff/dashboard" },
      { label: "Place an order", href: "/staff/dashboard/placeorder", current: true },
    ]

      },
    orderPreview: {
    title: "Order Preview",
    breadcrumbs: [
      { label: "Dashboards", href: "/staff/dashboard" },
      { label: "Place an order", href: "/staff/dashboard/order-preview", current: true },
    ],
  },
  addReceivers: {
    title: "Add receivers",
    breadcrumbs: [
      { label: "Dashboards", href: "/staff/dashboard" },
      { label: "Manage receivers", href: "/staff/dashboard/manage-receivers" },
      { label: "Add receivers", href: "/staff/dashboard/manage-receivers/add-receivers", current: true },
    ],
  },
}
