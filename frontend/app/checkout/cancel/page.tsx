"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function CheckoutCancelPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-[400px]">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Payment Cancelled</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-600 text-center">
            Your payment has been cancelled. Please try again or contact support.
          </p>
          <Button asChild variant="outline" className="w-full">
            <Link href="/pricing">Return to Pricing</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
