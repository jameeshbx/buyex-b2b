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
  createdAt: string;
  role: string;
};

export default function UserManagement() {
  const { data: session } = useSession();
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUserType, setFilteredUserType] = useState<UserType | "all">(
    "all"
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [, setLoading] = useState(true);
  const [, setError] = useState<string | null>(null);
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `/api/users?role=${session?.user?.role}`
        );
        const transformedUsers = response.data.map((apiUser: ApiUser) => ({
          id: apiUser.id,
          userId: apiUser.id,
          name: apiUser.name,
          email: apiUser.email,
          status: apiUser.status,
          date: apiUser.createdAt,
          userType: apiUser.role === "ADMIN" ? "Admin" : "Staff",
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

  const handleAddUser = async (user: UserFormData) => {
    try {
      const response = await axios.post("/api/users", {
        name: user.name,
        email: user.email,
        role: user.userType === "Admin" ? "ADMIN" : "MANAGER",
        status: true,
      });

      const newUser = {
        id: response.data.user.id,
        userId: response.data.user.id,
        name: response.data.user.name,
        email: response.data.user.email,
        status: response.data.user.status,
        date: response.data.user.createdAt,
        userType:
          response.data.user.role === "ADMIN"
            ? ("Admin" as UserType)
            : ("Staff" as UserType),
      };

      setUsers([newUser, ...users]);
    } catch (err) {
      console.error("Error adding user:", err);
      setError("Failed to add user");
    }
  };
  function handleToggleStatus(): void {
    throw new Error("Function not implemented.");
  }

  function handleDeleteUser(): void {
    throw new Error("Function not implemented.");
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <UserForm onAddUser={handleAddUser} />
      <UserTable
        users={users}
        onToggleStatus={handleToggleStatus}
        onDeleteUser={handleDeleteUser}
        filteredUserType={filteredUserType}
        setFilteredUserType={setFilteredUserType}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      <div className="text-xs text-gray-500 text-center pt-4">
        © 2025, Made by BuyExchange.
      </div>
    </div>
  );
}
