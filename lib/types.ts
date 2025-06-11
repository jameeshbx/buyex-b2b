export type UserType = "Admin" | "Staff"

export interface User {
  id: string
  userId: string
  userType: UserType
  name: string
  email: string
  date: string
  status: boolean
}

export interface UserFormData {
  userType: UserType
  userId: string
  name: string
  email: string
}
