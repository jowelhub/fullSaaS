"use client";

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useSmoothScroll } from "@/hooks/use-smooth-scroll"
import { useState } from "react";
import { Menu } from "lucide-react";

export default function Navigation() {
  useSmoothScroll()
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

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
          <Button variant="ghost" className="text-gray-600 hover:text-[#10B981] hidden md:inline-flex" asChild>
            <Link href="/login">Log in</Link>
          </Button>
          <Button className="bg-[#10B981] hover:bg-[#10B981]/90 text-white hidden md:inline-flex" asChild>
            <Link href="/signup">Get Started</Link>
          </Button>
          <Menu className="md:hidden h-6 w-6 cursor-pointer" onClick={toggleMenu} />
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-16 right-0 bg-white shadow-md rounded-md p-4 w-48">
          <Link href="#features" className="block py-2 text-gray-600 hover:text-[#10B981]" onClick={toggleMenu}>
            Features
          </Link>
          <Link href="#pricing" className="block py-2 text-gray-600 hover:text-[#10B981]" onClick={toggleMenu}>
            Pricing
          </Link>
          <Link href="#faq" className="block py-2 text-gray-600 hover:text-[#10B981]" onClick={toggleMenu}>
            FAQ
          </Link>
          <Link href="/login" className="block py-2 text-gray-600 hover:text-[#10B981]" onClick={toggleMenu}>
            Log in
          </Link>
          <Link href="/signup" className="block py-2 text-gray-600 hover:text-[#10B981]" onClick={toggleMenu}>
            Get Started
          </Link>
        </div>
      )}
    </nav>
  )
}
