"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export function useAuth(redirectTo = "/login", requireAdmin = false) {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const check = async () => {
      const token = localStorage.getItem("token")
      if (!token) {
        router.push(redirectTo)
        return
      }

      try {
        const res = await fetch("http://localhost:5000/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (!res.ok) throw new Error("Unauthorized")

        const user = await res.json()

        if (requireAdmin && user.role !== "admin") {
          router.push("/unauthorized")
          return
        }

        setUser(user)
      } catch {
        router.push(redirectTo)
      } finally {
        setLoading(false)
      }
    }

    check()
  }, [redirectTo, requireAdmin, router])

  return { user, loading }
}
