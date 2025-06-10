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
  orderDetails: {
    title: "Place an order",
    breadcrumbs: [
      { label: "Dashboard", href: "/dashboard" },
      { label: "Place an order", href: "/staff/dashboard/placeorder", current: true },
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
  documentUpload: {
    title: "Place an order",
    breadcrumbs: [
       { label: "Dashboards", href: "/dashboards" },
      { label: "Place an order", href: "/staff/dashboard/document-upload", current: true },
    ],
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
  listReceivers: {
    title: "Manage receivers",
    breadcrumbs: [
      { label: "Dashboards", href: "/staff/dashboard" },
      { label: "Manage receivers", href: "/staff/dashboard/manage-receivers/list-receivers", current: true },
    ],
  },
  manageUsers: {
    title: "Manage users",
    breadcrumbs: [
      { label: "Dashboards", href: "/admin/dashboard" },
      { label: "Manage users", href: "/admin/dashboard/manage-users", current: true },
    ],
  },
  nativeUsers: {
    title: "Manage native users",
    breadcrumbs: [
      { label: "Dashboards", href: "/super-admin/dashboard" },
      { label: "Native users", href: "/super-admin/dashboard/native-users", current: true },
    ],
  },
}
