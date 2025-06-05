export const staffData = [
    {
        id: "EMP001",
        staffName: "John Doe",
        email: "john.doe@example.com",
        status: "active" as const,
    },
    {
        id: "EMP002",
        staffName: "Jane Smith",
        email: "jane.smith@example.com",
        status: "active" as const,
    },
    {
        id: "EMP003",
        staffName: "Robert Johnson",
        email: "robert.j@example.com",
        status: "inactive" as const,
    },
    {
        id: "EMP004",
        staffName: "Emily Davis",
        email: "emily.d@example.com",
        status: "active" as const,
    },
    {
        id: "EMP005",
        staffName: "Michael Brown",
        email: "michael.b@example.com",
        status: "inactive" as const,
    },
    {
        id: "EMP006",
        staffName: "Sarah Wilson",
        email: "sarah.w@example.com",
        status: "active" as const,
    },
]

export type StaffMember = typeof staffData[0]