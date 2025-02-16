import PricingPlans from "@/components/pricing-plans";

export default function Pricing() {
  return (
    <section id="pricing" className="w-full py-20 md:py-32">
      <div className="container">
        <div className="flex flex-col items-center text-center">
          <div className="text-[#10B981] font-medium mb-2">PRICING</div>
          <h2 className="text-3xl font-bold sm:text-5xl mb-4">Simple, transparent pricing</h2>
          <p className="max-w-[800px] text-gray-600 md:text-lg mb-12">
            Choose the perfect plan for your needs. No hidden fees.
          </p>
        </div>
        <PricingPlans buttonText="Get Started" buttonLink="/signup" />
      </div>
    </section>
  );
}
