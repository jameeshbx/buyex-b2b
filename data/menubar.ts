// Define the menu items structure
export interface MenuItem {
  id: string;
  label: string;
  url: string;
  active?: boolean;
  onClick?: (e: React.MouseEvent) => void;
}

// Define the menu items
export const menuItems = (orderId: string = ''): MenuItem[] => {
  const items: MenuItem[] = [
    {
      id: "order-details",
      label: "Order Details",
      url: "#", // No redirection for order-details
      onClick: (e: React.MouseEvent) => {
        e.preventDefault();
        // No navigation for order-details
      },
    },
    {
      id: "sender-details",
      label: "Sender details",
      url: `/staff/dashboard/sender-details${orderId ? `?orderId=${orderId}` : ''}`,
    },
    {
      id: "beneficiary-details",
      label: "Beneficiary details",
      url: `/staff/dashboard/beneficiary-details${orderId ? `?orderId=${orderId}` : ''}`,
    },
    {
      id: "documents",
      label: "Documents",
      url: `/staff/dashboard/document-upload${orderId ? `?orderId=${orderId}` : ''}`,
    },
  ];
  return items;
};

// Function to get active menu item based on URL
export const getActiveMenuItem = (currentPath: string, orderId: string = ''): MenuItem[] => {
  return menuItems(orderId).map((item: MenuItem) => ({
    ...item,
    active: currentPath.includes(item.url.split('?')[0]),
  }));
};
