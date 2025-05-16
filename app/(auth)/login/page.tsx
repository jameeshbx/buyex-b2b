"use client"

import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function LoginPage() {
    const router = useRouter()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        const res = await signIn("credentials", {
            email,
            password,
            redirect: false,
        })

        if (res?.ok) router.push("/dashboard")
        else alert("Invalid credentials")
    }

    return (
        <form onSubmit={handleLogin} className="max-w-sm mx-auto mt-24 space-y-4">
            <h1 className="text-xl font-bold">Login</h1>
            <input
                type="email"
                placeholder="Email"
                className="w-full border p-2"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <input
                type="password"
                placeholder="Password"
                className="w-full border p-2"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit" className="bg-black text-white px-4 py-2 rounded">
                Sign In
            </button>
        </form>
    )
}
