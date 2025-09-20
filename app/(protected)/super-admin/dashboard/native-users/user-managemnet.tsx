"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { UserForm } from "./user-form";
import { UserTable } from "./user-table";
import type { User, UserType, UserFormData } from "@/lib/types";

// Define the ApiUser type based on the expected API response
type ApiUser = {
  id: string;
  name: string;
  email: string;
  status: boolean;
  createdAt: string; // ISO string
  role: string;
  agentRates?: Record<string, number> | null; // agentRates as JSON object
  forexPartner?: string | null;
  buyexRates?: Record<string, number> | null; // buyexRates as JSON object
};

// Helper function to convert UserType to API role
const convertUserTypeToRole = (userType: UserType): string => {
  switch (userType) {
    case "Admin":
      return "ADMIN";
    case "Staff":
      return "MANAGER";
    case "Agent":
      return "AGENT";
    default:
      return "MANAGER"; // default fallback
  }
};

export default function UserManagement() {
  const { data: session } = useSession();
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUserType, setFilteredUserType] = useState<UserType | "all">(
    "all"
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        // Pass the current user's role to the API for access control simulation
        const response = await axios.get(
          `/api/users?role=${session?.user?.role}`
        );
        const transformedUsers = response.data.map((apiUser: ApiUser) => ({
          id: apiUser.id,
          userId: apiUser.id, // Keeping userId for consistency with existing client code
          name: apiUser.name,
          email: apiUser.email,
          status: apiUser.status,
          date: apiUser.createdAt, // Already an ISO string from API
          userType: convertRoleToUserType(apiUser.role),
          agentRates: apiUser.agentRates ?? undefined, // Convert null to undefined for client type
          forexPartner: apiUser.forexPartner ?? undefined,
          buyexRates: apiUser.buyexRates ?? undefined,
        }));
        setUsers(transformedUsers);
      } catch (error) {
        setError("Failed to fetch users");
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    if (session?.user?.role) {
      fetchUsers();
    }
  }, [session]);

  // Helper function to convert API role to UserType
  const convertRoleToUserType = (role: string): UserType => {
    switch (role) {
      case "ADMIN":
        return "Admin";
      case "MANAGER":
        return "Staff";
      case "AGENT":
        return "Agent";
      default:
        return "Staff"; // default fallback
    }
  };

  const handleAddUser = async (user: UserFormData) => {
    try {
      // Get rates for the default currency (USD)
      const defaultCurrency = "USD";
      let agentRate: number | undefined;
      let buyexRate: number | undefined;
      
      if (user.userType === "Agent") {
        // Handle agentRate
        if (!user.agentRates) {
          throw new Error("Agent rates are required for Agent users");
        }
        
        const agentRateValue = user.agentRates[defaultCurrency as keyof typeof user.agentRates];
        if (agentRateValue === undefined || agentRateValue === null) {
          throw new Error("Agent rate is required for the selected currency");
        }
        
        const parsedAgentRate = typeof agentRateValue === 'string' 
          ? parseFloat(agentRateValue) 
          : agentRateValue;
          
        if (isNaN(parsedAgentRate)) {
          throw new Error("Invalid agent rate: must be a valid number");
        }
        
        if (parsedAgentRate < 0 || parsedAgentRate > 100) {
          throw new Error("Agent rate must be between 0 and 100");
        }
        
        agentRate = parsedAgentRate;
        
        // Handle buyexRate
        if (!user.buyexRates) {
          throw new Error("Buyex rates are required for Agent users");
        }
        
        const buyexRateValue = user.buyexRates[defaultCurrency as keyof typeof user.buyexRates];
        if (buyexRateValue === undefined || buyexRateValue === null) {
          throw new Error("Buyex rate is required for the selected currency");
        }
        
        const parsedBuyexRate = typeof buyexRateValue === 'string'
          ? parseFloat(buyexRateValue)
          : buyexRateValue;
          
        if (isNaN(parsedBuyexRate)) {
          throw new Error("Invalid buyex rate: must be a valid number");
        }
        
        if (parsedBuyexRate < 0 || parsedBuyexRate > 100) {
          throw new Error("Buyex rate must be between 0 and 100");
        }
        
        buyexRate = parsedBuyexRate;
      }

      const response = await axios.post("/api/users", {
        userType: user.userType,
        name: user.name,
        email: user.email,
        organisationId: user.organisationId, // Keep organisationId for all user types
        agentRate: user.userType === "Agent" ? agentRate : undefined, // This will be validated above
        buyexRate: user.userType === "Agent" ? buyexRate : undefined, // Include buyexRate for all user types
        forexPartner: user.userType === "Agent" ? user.forexPartner : undefined,
        // status is defaulted to true on the server
      });
      if (response.status === 201) {
        const newUser: User = {
          id: response.data.user.id,
          userId: response.data.user.id,
          name: response.data.user.name,
          email: response.data.user.email,
          status: response.data.user.status,
          date: response.data.user.createdAt, // API returns createdAt as ISO string
          userType: convertRoleToUserType(response.data.user.userRole), // API returns userRole
          agentRates: response.data.user.agentRates ?? undefined,
          forexPartner: response.data.user.forexPartner,
          buyexRates: response.data.user.buyexRates,
        };
        setUsers([newUser, ...users]);
      }
    } catch (err) {
      console.error("Error adding user:", err);
      setError("Failed to add user");
      throw err;
    }
  };

  const handleToggleStatus = async (id: string) => {
    try {
      const user = users.find((u) => u.id === id);
      if (!user) return;
      const response = await axios.put(`/api/users?id=${id}`, {
        status: !user.status,
      });
      if (response.status === 200) {
        setUsers(
          users.map((u) => (u.id === id ? { ...u, status: !u.status } : u))
        );
      }
    } catch (error) {
      console.error("Error toggling user status:", error);
      setError("Failed to update user status");
    }
  };

  const handleDeleteUser = async (id: string) => {
    try {
      const response = await axios.delete(`/api/users?id=${id}`);
      if (response.status === 200) {
        setUsers(users.filter((u) => u.id !== id));
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      setError("Failed to delete user");
    }
  };

  const handleEditUser = async (
    id: string,
    userData: {
      name: string;
      email: string;
      userType: UserType;
      agentRates?: Record<string, number>;
      forexPartner?: string;
      buyexRates?: Record<string, number>;
    }
  ) => {
    try {
      const response = await axios.put(`/api/users?id=${id}`, {
        name: userData.name,
        email: userData.email,
        role: convertUserTypeToRole(userData.userType), // Convert client userType to DB role
        agentRates:
          userData.userType === "Agent" ? userData.agentRates : undefined,
        forexPartner:
          userData.userType === "Agent" ? userData.forexPartner : undefined,
        buyexRates:
          userData.userType === "Agent" ? userData.buyexRates : undefined,
      });
      if (response.status === 200) {
        setUsers(
          users.map((u) =>
            u.id === id
              ? {
                  ...u,
                  name: response.data.name,
                  email: response.data.email,
                  userType: convertRoleToUserType(response.data.role), // Convert DB role back to client userType
                  agentRates: response.data.agentRates ?? undefined,
                  status: response.data.status,
                  forexPartner: response.data.forexPartner,
                  buyexRates: response.data.buyexRates, // Ensure status is updated from API response
                }
              : u
          )
        );
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error editing user:", error);
      setError("Failed to update user");
      return false;
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-center justify-center py-8">
          <div className="text-lg">Loading users...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
          <button
            onClick={() => setError(null)}
            className="float-right font-bold"
          >
            ×
          </button>
        </div>
      )}
      <UserForm onAddUser={handleAddUser} />
      <UserTable
        users={users}
        onToggleStatus={handleToggleStatus}
        onDeleteUser={handleDeleteUser}
        onEditUser={handleEditUser}
        filteredUserType={filteredUserType}
        setFilteredUserType={setFilteredUserType}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      <div className="text-xs text-gray-500 text-center pt-4">
        © 2025, Made by BuyEx Forex.
      </div>
    </div>
  );
}
