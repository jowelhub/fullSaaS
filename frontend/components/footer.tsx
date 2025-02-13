import Link from "next/link"

export default function Footer() {
  return (
    <footer className="w-full border-t py-6">
      <div className="container flex justify-between items-center">
        <p className="text-gray-600">© {new Date().getFullYear()} SaaSFlow. All rights reserved.</p>
        <div className="flex space-x-6">
          <Link href="/terms" className="text-gray-600 hover:text-[#10B981]">
            Terms
          </Link>
          <Link href="/privacy" className="text-gray-600 hover:text-[#10B981]">
            Privacy
          </Link>
          <Link href="/contact" className="text-gray-600 hover:text-[#10B981]">
            Contact
          </Link>
        </div>
      </div>
    </footer>
  )
}
