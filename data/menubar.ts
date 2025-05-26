// Define the menu items structure
export interface MenuItem {
  id: string
  label: string
  url: string
  active?: boolean
}

// Define the menu items
export const menuItems: MenuItem[] = [
  {
    id: "order-details",
    label: "Order Details",
    url: "/staff/dashboard/order-details",
  },
  {
    id: "sender-details",
    label: "Sender details",
    url: "/staff/dashboard/sender-details",
  },
  {
    id: "beneficiary-details",
    label: "Beneficiary details",
    url: "/staff/dashboard/beneficiary-details",
  },
  {
    id: "documents",
    label: "Documents",
    url: "/documents",
  },
]

// Function to get active menu item based on URL
export const getActiveMenuItem = (currentPath: string): MenuItem[] => {
  return menuItems.map((item) => ({
    ...item,
    active: currentPath.includes(item.url),
  }))
}

