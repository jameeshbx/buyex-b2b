export type UserType = "Admin" | "Staff" | "Agent"

export interface User {
  id: string
  userId: string
  name: string
  email: string
  status: boolean
  date: string
  userType: UserType
  agentRates?: Record<string, number>;
  forexPartner?: string;
  buyexRates?: Record<string, number>;
  // For API compatibility
  role?: "ADMIN" | "MANAGER" | "AGENT" // From your API
  createdAt?: string          // From your API
}

export interface UserFormData {
  userType: UserType;
  userId: string;
  name: string;
  email: string;
  organisationId?: string;
  agentRates?: Record<string, number>;
  forexPartner?: string;
  buyexRates?: Record<string, number>;
}
