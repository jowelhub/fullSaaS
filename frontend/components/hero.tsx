import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Hero() {
  return (
    <section className="w-full py-10 md:py-12">
      <div className="container flex flex-col items-center text-center">
        <div className="inline-flex items-center rounded-full bg-[#DCFCE7] px-3 py-1 text-sm text-[#10B981] mb-4">
          Launch faster
        </div>
        <h1 className="max-w-4xl text-4xl font-bold tracking-tight sm:text-6xl md:text-7xl lg:text-8xl">
          The modern platform for <span className="text-[#10B981]">indie developers</span>
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-gray-600 md:text-xl">
          Build, launch, and scale your SaaS project with our powerful developer tools and streamlined workflow.
        </p>
        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:gap-6">
          <Button className="bg-[#10B981] hover:bg-[#10B981]/90 text-white h-12 px-8 text-base" asChild>
            <Link href="/signup">Get Started</Link>
          </Button>
          <Button variant="outline" className="h-12 px-8 text-base" asChild>
            <Link href="#demo">View Demo</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
