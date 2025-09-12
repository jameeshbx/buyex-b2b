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
  agentRate?: number | null; // agentRate can be null if not an agent
  forexPartner?: string | null;
  buyexRate?: number | null;
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
          agentRate: apiUser.agentRate ?? undefined, // Convert null to undefined for client type
          forexPartner: apiUser.forexPartner ?? undefined,
          buyexRate: apiUser.buyexRate ?? undefined,
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
      const response = await axios.post("/api/users", {
        userType: user.userType,
        name: user.name,
        email: user.email,
        organisationId:
          user.userType === "Agent" ? user.organisationId : undefined,
        agentRate: user.userType === "Agent" ? user.agentRate : undefined,
        forexPartner: user.userType === "Agent" ? user.forexPartner : undefined,
        buyexRate: user.userType === "Agent" ? user.buyexRate : undefined,
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
          agentRate: response.data.user.agentRate ?? undefined,
          forexPartner: response.data.user.forexPartner,
          buyexRate: response.data.user.buyexRate,
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
      agentRate?: number;
      forexPartner?: string;
      buyexRate?: number;
    }
  ) => {
    try {
      const response = await axios.put(`/api/users?id=${id}`, {
        name: userData.name,
        email: userData.email,
        role: convertUserTypeToRole(userData.userType), // Convert client userType to DB role
        agentRate:
          userData.userType === "Agent" ? userData.agentRate : undefined,
        forexPartner:
          userData.userType === "Agent" ? userData.forexPartner : undefined,
        buyexRate:
          userData.userType === "Agent" ? userData.buyexRate : undefined,
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
                  agentRate: response.data.agentRate ?? undefined,
                  status: response.data.status,
                  forexPartner: response.data.forexPartner,
                  buyexRate: response.data.buyexRate, // Ensure status is updated from API response
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
