export type BreadcrumbItem = {
  label: string;
  href: string;
  current?: boolean;
};

export type PageData = {
  title: string;
  breadcrumbs: BreadcrumbItem[];
};

export const agentPagesData: Record<string, PageData> = {
  dashboard: {
    title: "Agent Dashboard",
    breadcrumbs: [
      { label: "Dashboard", href: "/agent/dashboard", current: true },
    ],
  },
  placeOrder: {
    title: "Place an Order",
    breadcrumbs: [
      { label: "Dashboard", href: "/agent/dashboard" },
      { label: "Place an Order", href: "/agent/dashboard/placeorder", current: true },
    ],
  },
  viewOrders: {
    title: "View Orders",
    breadcrumbs: [
      { label: "Dashboard", href: "/agent/dashboard" },
      { label: "View Orders", href: "/agent/dashboard/view-orders", current: true },
    ],
  },
  fileUpload: {
    title: "Files And Uploads",
    breadcrumbs: [
      { label: "Dashboard", href: "/agent/dashboard" },
      { label: "Files And Uploads", href: "/agent/dashboard/upload-files", current: true },
    ],
  },
  // Add more agent-specific pages as needed
};

export default agentPagesData;
