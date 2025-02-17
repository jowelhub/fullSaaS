"use client"

import { useSession, signOut } from "next-auth/react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { usePathname } from "next/navigation"
import Loading from "@/components/loading"
import type React from "react"
import { useState } from "react";
import { Menu } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: session, status } = useSession()
  const pathname = usePathname()
    const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

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
          <div className="flex items-center space-x-8 md:flex hidden">
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
           <Menu className="md:hidden h-6 w-6 cursor-pointer" onClick={toggleMenu} />
        </div>
      </nav>
       {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-16 right-0 bg-white shadow-md rounded-md p-4 w-48">
          <Link href="/dashboard" className="block py-2 text-gray-600 hover:text-[#10B981]" onClick={toggleMenu}>
             Dashboard
          </Link>
          <Link href="/pricing" className="block py-2 text-gray-600 hover:text-[#10B981]" onClick={toggleMenu}>
            Pricing
          </Link>
          <Link href="/settings" className="block py-2 text-gray-600 hover:text-[#10B981]" onClick={toggleMenu}>
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
      )}
      <main className="container mx-auto py-8">{children}</main>
    </div>
  )
}
