"use client";

import { useState, useEffect } from "react";
import axios, { AxiosError } from "axios";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";
import {
  OrganisationForm,
  type OrganisationFormData,
} from "./organisation-form";
import { OrganisationTable, type Organisation } from "./organisation-table";

export default function OrganisationManagement() {
  const [organisations, setOrganisations] = useState<Organisation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingOrganisation, setEditingOrganisation] =
    useState<Organisation | null>(null);
  const [, setViewingOrganisation] = useState<Organisation | null>(null);

  useEffect(() => {
    fetchOrganisations();
  }, []);

  const fetchOrganisations = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/organisations");
      setOrganisations(response.data);
    } catch (error) {
      setError("Failed to fetch organizations");
      console.error("Error fetching organizations:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrganisation = async (data: OrganisationFormData) => {
    try {
      const response = await axios.post("/api/organisations", data);
      const newOrganisation = response.data.organisation;
      setOrganisations([newOrganisation, ...organisations]);
      setShowForm(false);
    } catch (error) {
      console.error("Error creating organization:", error);
      const axiosError = error as AxiosError<{ error: string }>;
      throw new Error(
        axiosError.response?.data?.error || "Failed to create organization"
      );
    }
  };

  const handleUpdateOrganisation = async (data: OrganisationFormData) => {
    if (!editingOrganisation) return;

    try {
      const response = await axios.put(
        `/api/organisations?id=${editingOrganisation.id}`,
        data
      );
      const updatedOrganisation = response.data;
      setOrganisations(
        organisations.map((org) =>
          org.id === editingOrganisation.id ? updatedOrganisation : org
        )
      );
      setEditingOrganisation(null);
    } catch (error) {
      console.error("Error updating organization:", error);
      const axiosError = error as AxiosError<{ error: string }>;
      throw new Error(
        axiosError.response?.data?.error || "Failed to update organization"
      );
    }
  };

  const handleDeleteOrganisation = async (id: string) => {
    try {
      await axios.delete(`/api/organisations?id=${id}`);
      setOrganisations(organisations.filter((org) => org.id !== id));
    } catch (error) {
      console.error("Error deleting organization:", error);
      const axiosError = error as AxiosError<{ error: string }>;
      throw new Error(
        axiosError.response?.data?.error || "Failed to delete organization"
      );
    }
  };

  const handleEdit = (organisation: Organisation) => {
    setEditingOrganisation(organisation);
    setShowForm(true);
  };

  const handleView = (organisation: Organisation) => {
    setViewingOrganisation(organisation);
    // You can implement a modal or navigate to a detail page
    console.log("Viewing organization:", organisation);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingOrganisation(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading organizations...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {error}
        <Button
          onClick={() => {
            setError(null);
            fetchOrganisations();
          }}
          variant="outline"
          size="sm"
          className="ml-2"
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Organizations</h1>
          <p className="text-gray-600">Manage your partner organizations</p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Organization
        </Button>
      </div>

      {showForm ? (
        <OrganisationForm
          organisation={editingOrganisation || undefined}
          onSubmit={
            editingOrganisation
              ? handleUpdateOrganisation
              : handleCreateOrganisation
          }
          onCancel={handleCancel}
          mode={editingOrganisation ? "edit" : "create"}
        />
      ) : (
        <OrganisationTable
          organisations={organisations}
          onEdit={handleEdit}
          onDelete={handleDeleteOrganisation}
          onView={handleView}
        />
      )}
    </div>
  );
}
