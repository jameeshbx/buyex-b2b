export type BreadcrumbItem = {
  label: string;
  href: string;
  current?: boolean;
};

export type PageData = {
  title: string;
  breadcrumbs: BreadcrumbItem[];
};

export const adminPagesData: Record<string, PageData> = {
  dashboard: {
    title: "Admin Dashboard",
    breadcrumbs: [
      { label: "Dashboard", href: "/admin/dashboard", current: true },
    ],
  },
  manageUsers: {
    title: "Manage Users",
    breadcrumbs: [
      { label: "Dashboard", href: "/admin/dashboard" },
      { label: "Manage Users", href: "/admin/dashboard/manage-users", current: true },
    ],
  },
  fileUpload: {
    title: "Files And Uploads",
    breadcrumbs: [
      { label: "Dashboards", href: "/admin/dashboard" },
      { label: "Files And Uploads", href: "/admin/dashboard/upload-files", current: true },
      ],
  },
  // Add more admin-specific pages as needed
};

export default adminPagesData;
