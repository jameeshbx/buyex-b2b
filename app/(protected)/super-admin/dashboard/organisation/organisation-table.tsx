"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Edit, Trash2, Users, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AxiosError } from "axios";

export interface Organisation {
  id: string;
  name: string;
  slug: string;
  email: string;
  commission: number;
  phoneNumber: string;
  logoUrl?: string;
  settings?: Record<string, string>;
  createdAt: string;
  updatedAt: string;
  _count?: {
    users: number;
  };
}

interface OrganisationTableProps {
  organisations: Organisation[];
  onEdit: (organisation: Organisation) => void;
  onDelete: (id: string) => void;
  onView: (organisation: Organisation) => void;
}

export function OrganisationTable({
  organisations,
  onEdit,
  onDelete,
  onView,
}: OrganisationTableProps) {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredOrganisations = organisations.filter(
    (org) =>
      org.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      org.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      org.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this organization?")) {
      try {
        await onDelete(id);
        toast.success("Organization deleted successfully");
      } catch (error) {
        const axiosError = error as AxiosError<{ error: string }>;
        toast.error(
          axiosError.response?.data?.error || "Failed to delete organization"
        );
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Input
            placeholder="Search organizations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-64"
          />
        </div>
        <div className="text-sm text-gray-500">
          {filteredOrganisations.length} of {organisations.length} organizations
        </div>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Commission</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Users</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="w-[50px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrganisations.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="text-center py-8 text-gray-500"
                >
                  No organizations found
                </TableCell>
              </TableRow>
            ) : (
              filteredOrganisations.map((organisation) => (
                <TableRow key={organisation.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center space-x-2">
                      {organisation.logoUrl && (
                        <img
                          src={organisation.logoUrl}
                          alt={organisation.name}
                          className="w-6 h-6 rounded"
                        />
                      )}
                      <span>{organisation.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className="bg-gray-100 text-gray-800">
                      {organisation.slug}
                    </Badge>
                  </TableCell>
                  <TableCell>{organisation.email}</TableCell>
                  <TableCell>
                    <Badge className="bg-blue-100 text-blue-800 border border-blue-200">
                      {organisation.commission}%
                    </Badge>
                  </TableCell>
                  <TableCell>{organisation.phoneNumber}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <Users className="h-4 w-4 text-gray-500" />
                      <span>{organisation._count?.users || 0}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {new Date(organisation.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onView(organisation)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onEdit(organisation)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDelete(organisation.id)}
                          className="text-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
