"use client";

import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Session } from "next-auth";

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

interface SessionWithAccessToken extends Session {
  accessToken?: string;
  refreshToken?: string;
  error?: string;
}

export default function PricingPage() {
  const { data: session, status } = useSession<SessionWithAccessToken>();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;

    if (!session?.accessToken) {
      // Redirect to login if not authenticated (handled by middleware)
      router.push("/login"); // Or wherever your login page is
    }
  }, [session, router, status]);

  const handleBuyPlan = async () => {
    const priceId = "1"; // Hardcoded for now

    try {
      const response = await fetch("http://127.0.0.1:8000/api/v1/billing/checkout/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.accessToken}`,
        },
        body: JSON.stringify({ price_id: priceId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error creating checkout session:", errorData);
        // Handle error (e.g., display an error message)
        return;
      }

      const data = await response.json();
      const sessionId = data.sessionId;

      // Redirect to Stripe Checkout
      const stripePromise = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "");

      if (stripePromise) {
        const result = await stripePromise.redirectToCheckout({
          sessionId: sessionId,
        });

        if (result.error) {
          console.error("Stripe redirect error:", result.error.message);
          // Handle redirect error (e.g., display an error message)
        }
      } else {
        console.error("Stripe failed to load.");
      }
    } catch (error) {
      console.error("Error during checkout:", error);
      // Handle network or other errors
    }
  };

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return (
    <section className="w-full py-20 md:py-32">
      <div className="container">
        <div className="flex flex-col items-center text-center">
          <div className="text-[#10B981] font-medium mb-2">PRICING</div>
          <h2 className="text-3xl font-bold sm:text-5xl mb-4">Simple, transparent pricing</h2>
          <p className="max-w-[800px] text-gray-600 md:text-lg mb-12">
            Choose the perfect plan for your needs. No hidden fees.
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative rounded-2xl p-8 ${
                plan.popular ? "border-2 border-[#10B981]" : "border border-gray-200"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#10B981] px-3 py-1 text-sm text-white">
                  Popular
                </div>
              )}
              <h3 className="text-2xl font-bold">{plan.name}</h3>
              <p className="text-gray-600 mt-2">{plan.description}</p>
              <div className="mt-6 mb-8">
                <span className="text-5xl font-bold">${plan.price}</span>
                <span className="text-gray-600">/month</span>
              </div>
              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center">
                    <Check className="h-5 w-5 text-[#10B981] mr-3" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Button
                className={`w-full ${
                  plan.popular ? "bg-[#10B981] hover:bg-[#10B981]/90" : "bg-gray-900 hover:bg-gray-800"
                }`}
                onClick={handleBuyPlan}
              >
                Buy Now
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
