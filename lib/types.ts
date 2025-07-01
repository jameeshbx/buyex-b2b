export type UserType = "Admin" | "Staff"

export interface User {
  id: string
  userId: string
  name: string
  email: string
  status: boolean
  date: string
  userType: UserType
  // For API compatibility
  role?: "ADMIN" | "MANAGER"  // From your API
  createdAt?: string          // From your API
}

export interface UserFormData {
  userType: UserType
  userId: string
  name: string
  email: string
}
