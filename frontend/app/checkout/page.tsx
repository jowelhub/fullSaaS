"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Link from "next/link";

export default function CheckoutPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-[500px]">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Checkout</CardTitle>
          <CardDescription>Review your order and proceed to payment</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Order Summary */}
          <div>
            <h3 className="text-lg font-semibold">Order Summary</h3>
            <ul className="mt-2 space-y-2">
              <li>
                <div className="flex justify-between">
                  <span>Product 1</span>
                  <span>$19.99</span>
                </div>
              </li>
              <li>
                <div className="flex justify-between">
                  <span>Product 2</span>
                  <span>$29.99</span>
                </div>
              </li>
              {/* Add more order items here */}
            </ul>
            <div className="flex justify-between font-semibold mt-4">
              <span>Total:</span>
              <span>$49.98</span>
            </div>
          </div>

          {/* Payment Information (Placeholder) */}
          <div>
            <h3 className="text-lg font-semibold">Payment Information</h3>
            <p className="text-gray-600">
              This section will eventually contain the payment form (Stripe Elements).
            </p>
          </div>

          {/* Proceed to Payment Button */}
          <Button className="w-full bg-[#10B981] hover:bg-[#10B981]/90 text-white">
            Proceed to Payment
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
