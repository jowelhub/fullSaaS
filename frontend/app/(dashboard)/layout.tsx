"use client"

import { useSession, signOut } from "next-auth/react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { usePathname } from "next/navigation"
import Loading from "@/components/loading"
import type React from "react"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: session, status } = useSession()
  const pathname = usePathname()

  if (status === "loading") {
    return <Loading />
  }

  if (!session) {
    return null // The middleware will redirect to login
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="sticky top-0 z-50 w-full bg-white border-b">
        <div className="container mx-auto flex h-16 items-center justify-between">
          <Link href="/dashboard" className="text-2xl font-bold text-[#10B981]">
            SaaSFlow
          </Link>
          <div className="flex items-center space-x-8">
            <Link
              href="/dashboard"
              className={`text-base ${
                pathname === "/dashboard" ? "text-[#10B981]" : "text-gray-600 hover:text-[#10B981]"
              }`}
            >
              Dashboard
            </Link>
            <Link
              href="/pricing"
              className={`text-base ${
                pathname === "/pricing" ? "text-[#10B981]" : "text-gray-600 hover:text-[#10B981]"
              }`}
            >
              Pricing
            </Link>
            <Link
              href="/settings"
              className={`text-base ${
                pathname === "/settings" ? "text-[#10B981]" : "text-gray-600 hover:text-[#10B981]"
              }`}
            >
              Settings
            </Link>
            <Button
              variant="ghost"
              className="text-gray-600 hover:text-[#10B981]"
              onClick={() => signOut({ callbackUrl: "/" })}
            >
              Log out
            </Button>
          </div>
        </div>
      </nav>
      <main className="container mx-auto py-8">{children}</main>
    </div>
  )
}
