"use client"

import { signOut } from "next-auth/react"

export default function DashboardPage() {
    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Dashboard</h1>
                <button
                    onClick={() => signOut({ callbackUrl: "/signin" })}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition-colors"
                >
                    Logout
                </button>
            </div>
        </div>
    );
}