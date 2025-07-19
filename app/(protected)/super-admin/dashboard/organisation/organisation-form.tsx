"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

export interface OrganisationFormData {
  name: string;
  slug: string;
  email: string;
  commission: number;
  phoneNumber: string;
  logoUrl?: string;
  settings?: Record<string, string>;
}

interface OrganisationFormProps {
  organisation?: {
    id: string;
    name: string;
    slug: string;
    email: string;
    commission: number;
    phoneNumber: string;
    logoUrl?: string;
    settings?: Record<string, string>;
  };
  onSubmit: (data: OrganisationFormData) => Promise<void>;
  onCancel: () => void;
  mode: "create" | "edit";
}

export function OrganisationForm({
  organisation,
  onSubmit,
  onCancel,
  mode,
}: OrganisationFormProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<OrganisationFormData>({
    name: organisation?.name || "",
    slug: organisation?.slug || "",
    email: organisation?.email || "",
    commission: organisation?.commission || 0,
    phoneNumber: organisation?.phoneNumber || "",
    logoUrl: organisation?.logoUrl || "",
    settings: organisation?.settings || {},
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await onSubmit(formData);
      toast.success(
        `Organization ${mode === "create" ? "created" : "updated"} successfully`
      );
    } catch (error) {
      toast.error(`Failed to ${mode} organization: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    field: keyof OrganisationFormData,
    value: string | number
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>
          {mode === "create" ? "Create Organization" : "Edit Organization"}
        </CardTitle>
        <CardDescription>
          {mode === "create"
            ? "Add a new organization to the system"
            : "Update organization information"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Organization Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Enter organization name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">Slug *</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => handleInputChange("slug", e.target.value)}
                placeholder="organization-slug"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="contact@organization.com"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number *</Label>
              <Input
                id="phoneNumber"
                value={formData.phoneNumber}
                onChange={(e) =>
                  handleInputChange("phoneNumber", e.target.value)
                }
                placeholder="+1234567890"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="commission">Commission (%) *</Label>
              <Input
                id="commission"
                type="number"
                min="0"
                max="100"
                step="0.01"
                value={formData.commission}
                onChange={(e) =>
                  handleInputChange(
                    "commission",
                    parseFloat(e.target.value) || 0
                  )
                }
                placeholder="0.00"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="logoUrl">Logo URL</Label>
              <Input
                id="logoUrl"
                type="url"
                value={formData.logoUrl}
                onChange={(e) => handleInputChange("logoUrl", e.target.value)}
                placeholder="https://example.com/logo.png"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="settings">Settings (JSON)</Label>
            <Textarea
              id="settings"
              value={JSON.stringify(formData.settings, null, 2)}
              onChange={(e) => {
                try {
                  const parsed = JSON.parse(e.target.value);
                  handleInputChange("settings", parsed);
                } catch {
                  // Invalid JSON, keep as string
                }
              }}
              placeholder='{"key": "value"}'
              rows={4}
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {mode === "create" ? "Create" : "Update"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
