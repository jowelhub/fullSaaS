import Navigation from "@/components/navigation"
import Hero from "@/components/hero"
import Features from "@/components/features"
import Pricing from "@/components/pricing"
import FAQ from "@/components/faq"
import Footer from "@/components/footer"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <Navigation />
      <Hero />
      <Features />
      <Pricing />
      <FAQ />
      <Footer />
    </main>
  )
}
