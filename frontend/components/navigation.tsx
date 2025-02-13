"use client";

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useSmoothScroll } from "@/hooks/use-smooth-scroll"

export default function Navigation() {
  useSmoothScroll()

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b">
      <div className="container mx-auto flex h-16 items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-[#10B981]">
          SaaSFlow
        </Link>
        <div className="hidden space-x-8 md:flex">
          <a href="#features" className="text-base text-gray-600 hover:text-[#10B981]">
            Features
          </a>
          <a href="#pricing" className="text-base text-gray-600 hover:text-[#10B981]">
            Pricing
          </a>
          <a href="#faq" className="text-base text-gray-600 hover:text-[#10B981]">
            FAQ
          </a>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="ghost" className="text-gray-600 hover:text-[#10B981]" asChild>
            <Link href="/login">Log in</Link>
          </Button>
          <Button className="bg-[#10B981] hover:bg-[#10B981]/90 text-white" asChild>
            <Link href="/signup">Get Started</Link>
          </Button>
        </div>
      </div>
    </nav>
  )
}
