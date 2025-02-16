"use client";

import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const plans = [
  {
    name: "Basic",
    description: "Perfect for individuals and small teams.",
    price: "9",
    features: ["1 User", "10 GB Storage", "Basic Support"],
    popular: false,
    id: "basic",
  },
  {
    name: "Pro",
    description: "Ideal for growing businesses.",
    price: "49",
    features: ["5 Users", "100 GB Storage", "Priority Support", "Advanced Features"],
    popular: true,
    id: "pro",
  },
  {
    name: "Enterprise",
    description: "Tailored for large organizations.",
    price: "99",
    features: ["Unlimited Users", "Unlimited Storage", "Dedicated Support", "All Features"],
    popular: false,
    id: "enterprise",
  },
];

interface PricingPlansProps {
  buttonText: string;
  buttonLink: string;
  isDashboard?: boolean;
  handleBuyPlan?: () => Promise<void>;
}

export default function PricingPlans({ buttonText, buttonLink, isDashboard = false, handleBuyPlan }: PricingPlansProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {plans.map((plan, index) => (
        <div
          key={index}
          className={`relative rounded-2xl p-4 ${
            plan.popular ? "border-2 border-[#10B981]" : "border border-gray-200"
          }`}
        >
          {plan.popular && (
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#10B981] px-3 py-1 text-sm text-white">
              Popular
            </div>
          )}
          <h3 className="text-2xl font-bold">{plan.name}</h3>
          <p className="text-gray-600 mt-1">{plan.description}</p>
          <div className="mt-2 mb-4">
            <span className="text-4xl font-bold">${plan.price}</span>
            <span className="text-gray-600">/month</span>
          </div>
          <ul className="space-y-2 mb-4">
            {plan.features.map((feature, featureIndex) => (
              <li key={featureIndex} className="flex items-center">
                <Check className="h-4 w-4 text-[#10B981] mr-2" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
          <Button
            asChild={!isDashboard}
            className={`w-full text-sm ${
              plan.popular ? "bg-[#10B981] hover:bg-[#10B981]/90" : "bg-gray-900 hover:bg-gray-800"
            }`}
            onClick={isDashboard ? handleBuyPlan : undefined}
          >
            {isDashboard ? buttonText : <Link href={buttonLink}>{buttonText}</Link>}
          </Button>
        </div>
      ))}
    </div>
  );
}
