"use client";

import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Session } from "next-auth";
import PricingPlans from "@/components/pricing-plans";

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
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/billing/checkout/`, {
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
    <section className="w-full py-4 md:py-8">
      <div className="container">
        <div className="flex flex-col items-center text-center">
          <div className="text-[#10B981] font-medium mb-2">PRICING</div>
          <h2 className="text-3xl font-bold sm:text-5xl mb-4">Simple, transparent pricing</h2>
          <p className="max-w-[800px] text-gray-600 md:text-lg mb-12">
            Choose the perfect plan for your needs. No hidden fees.
          </p>
        </div>
        <PricingPlans
          buttonText="Buy Now"
          buttonLink="#"
          isDashboard={true}
          handleBuyPlan={handleBuyPlan}
        />
      </div>
    </section>
  );
}
