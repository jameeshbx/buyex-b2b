"use client";

import { useState, useEffect } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CheckCircle } from "lucide-react";
import type { UserFormData, UserType } from "@/lib/types";
import axios from "axios";

// Define the Organisation interface
interface Organisation {
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
}

const formSchema = z
  .object({
    userType: z.enum(["Admin", "Staff", "Agent"]),
    name: z.string().min(2, { message: "Name must be at least 2 characters" }),
    email: z.string().email({ message: "Please enter a valid email address" }),
    organisationId: z.string().optional(),
    agentRate: z
      .number()
      .optional()
      .refine((val) => val === undefined || (val >= 0 && val <= 100), {
        message: "Agent rate must be between 0 and 100",
      }),
      forexPartner: z.string().optional(),
    buyexRate: z
      .number()
      .optional()
      .refine((val) => val === undefined || (val >= 0 && val <= 100), {
        message: "Buyex rate must be between 0 and 100",
      }),
  })
  .superRefine((data, ctx) => {
    if (data.userType === "Agent") {
      if (
        data.agentRate === undefined ||
        data.agentRate < 0 ||
        data.agentRate > 100
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            "Agent rate is required and must be between 0 and 100 for Agent users",
          path: ["agentRate"],
        });
      }

        if (!data.forexPartner) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Forex Partner is required for Agent users",
          path: ["forexPartner"],
        });
      }
      if (data.buyexRate === undefined || data.buyexRate < 0 || data.buyexRate > 100) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Buyex rate is required and must be between 0 and 100 for Agent users",
          path: ["buyexRate"],
        });
      }
      if (!data.organisationId) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Organisation is required for Agent users",
          path: ["organisationId"],
        });
      }
    }
  });

type FormValues = z.infer<typeof formSchema>;

interface UserFormProps {
  onAddUser: (user: UserFormData) => Promise<void>;
}

export function UserForm({ onAddUser }: UserFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successDialog, setSuccessDialog] = useState<{
    open: boolean;
    message: string;
  }>({
    open: false,
    message: "",
  });
  const [, setSelectedUserType] = useState<UserType>("Admin");
  const [organisations, setOrganisations] = useState<Organisation[]>([]);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userType: "Admin",
      name: "",
      email: "",
      organisationId: "",
      agentRate: undefined,
    },
  });

  const userType = watch("userType");

  // Fetch organisations on component mount
  useEffect(() => {
    const fetchOrganisations = async () => {
      try {
        const response = await axios.get("/api/organisations");
        setOrganisations(response.data);
      } catch (error) {
        console.error("Error fetching organisations:", error);
      }
    };

    fetchOrganisations();
  }, []);

  const onSubmit = async (data: FormValues) => {
    try {
      setLoading(true);
      setError(null);
      await onAddUser({
        userType: data.userType,
        name: data.name,
        email: data.email,
        organisationId:
          data.userType === "Agent" ? data.organisationId : undefined,
        agentRate: data.userType === "Agent" ? data.agentRate : undefined,
        userId: "", // This will be set by the API response
      });
      // Reset form on success
      reset();
      // Show success popup
      setSuccessDialog({
        open: true,
        message:
          "User created successfully! An invitation email with login details has been sent.",
      });
    } catch (err: unknown) {
      console.error("Error creating user:", err);
      const axiosError = err as {
        response?: {
          data?: {
            error?: string;
          };
        };
      };
      setError(axiosError?.response?.data?.error || "Failed to create user");
    } finally {
      setLoading(false);
    }
  };

  const handleUserTypeChange = (value: UserType) => {
    setSelectedUserType(value);
    setValue("userType", value);
    if (value !== "Agent") {
      setValue("agentRate", undefined);
      setValue("organisationId", "");
    }
  };

  return (
    <>
      <Card className="bg-white shadow-sm">
        <CardContent className="pt-6">
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
              {error}
            </div>
          )}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            <div className="space-y-2">
              <Label htmlFor="userType">Usertype</Label>
              <Select defaultValue="Admin" onValueChange={handleUserTypeChange}>
                <SelectTrigger id="userType" className="w-full">
                  <SelectValue placeholder="Select user type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Admin">Admin</SelectItem>
                  <SelectItem value="Staff">Staff</SelectItem>
                  <SelectItem value="Agent">Agent</SelectItem>
                </SelectContent>
              </Select>
              {errors.userType && (
                <p className="text-red-500 text-xs">
                  {errors.userType.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="Enter user name"
                {...register("name")}
              />
              {errors.name && (
                <p className="text-red-500 text-xs">{errors.name.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email ID</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter email ID"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-red-500 text-xs">{errors.email.message}</p>
              )}
            </div>
            {userType === "Agent" && (
              <div className="space-y-2">
                <Label htmlFor="organisationId">Organisation</Label>
                <Select
                  onValueChange={(value) => setValue("organisationId", value)}
                >
                  <SelectTrigger id="organisationId" className="w-full">
                    <SelectValue placeholder="Select organisation" />
                  </SelectTrigger>
                  <SelectContent>
                    {organisations.map((org) => (
                      <SelectItem key={org.id} value={org.id}>
                        {org.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.organisationId && (
                  <p className="text-red-500 text-xs">
                    {errors.organisationId.message}
                  </p>
                )}
              </div>
            )}
            {userType === "Agent" && (
              <div className="space-y-2">
                <Label htmlFor="agentRate">Agent SettlementRate</Label>
                <Input
                  id="agentRate"
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  placeholder="Enter agent rate"
                  {...register("agentRate", {
                    valueAsNumber: true,
                  })}
                />
                {errors.agentRate && (
                  <p className="text-red-500 text-xs">
                    {errors.agentRate.message}
                  </p>
                )}
              </div>
            )}
            {userType === "Agent" && (
  <>
    <div className="space-y-2">
      <Label htmlFor="forexPartner">Forex Partner</Label>
      <Select
        onValueChange={(value) => setValue("forexPartner", value)}
      >
        <SelectTrigger id="forexPartner" className="w-full">
          <SelectValue placeholder="Select forex partner" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Ebix Cash World Money Ltd">Ebix Cash World Money Ltd</SelectItem>
          <SelectItem value="WSFX Global Pay Ltd">WSFX Global Pay Ltd</SelectItem>
          <SelectItem value="NIUM Forex India Pvt Ltd">NIUM Forex India Pvt Ltd</SelectItem>
        </SelectContent>
      </Select>
      {errors.forexPartner && (
        <p className="text-red-500 text-xs">{errors.forexPartner.message}</p>
      )}
    </div>
    <div className="space-y-2">
      <Label htmlFor="buyexRate">Buyex Rate</Label>
      <Input
        id="buyexRate"
        type="number"
        min="0"
        max="100"
        step="0.01"
        placeholder="Enter buyex rate"
        {...register("buyexRate", {
          valueAsNumber: true,
        })}
      />
      {errors.buyexRate && (
        <p className="text-red-500 text-xs">{errors.buyexRate.message}</p>
      )}
    </div>
  </>
)}
            <div className="flex items-end">
              <Button
                type="submit"
                className="w-full bg-[#004976] hover:bg-[#003a5e]"
                disabled={loading}
              >
                {loading ? "Creating..." : "Submit"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
      {/* Success Dialog remains the same */}
      <Dialog
        open={successDialog.open}
        onOpenChange={(open) => setSuccessDialog({ open, message: "" })}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0">
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
              <div>
                <DialogTitle className="text-green-800">Success!</DialogTitle>
                <DialogDescription className="text-green-600">
                  {successDialog.message}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
          <DialogFooter>
            <Button
              onClick={() => setSuccessDialog({ open: false, message: "" })}
              className="bg-[#004976] hover:bg-[#003a5e] w-full"
            >
              OK
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
