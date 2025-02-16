"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [message, setMessage] = useState<string | null>(null);
  const [isValidSession, setIsValidSession] = useState<boolean | null>(null);
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const verifySession = async () => {
      if (!sessionId) {
        setMessage("Error: Session ID is missing.");
        setIsValidSession(false);
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/billing/verify-stripe-session/`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${session?.accessToken}`,
            },
            body: JSON.stringify({ session_id: sessionId }),
          }
        );

        const data = await response.json();

        if (response.ok && data.isValid) {
          setMessage("Thank you for your order! Your payment has been processed successfully.");
          setIsValidSession(true);
        } else {
          setMessage("Error: Payment verification failed.");
          setIsValidSession(false);
        }
      } catch (error) {
        console.error("Error verifying session:", error);
        setMessage("Error: Could not verify payment status.");
        setIsValidSession(false);
      } finally {
        setIsLoading(false);
      }
    };

    verifySession();
  }, [sessionId, session?.accessToken]);

  if (isLoading) {
    return null; // Or return a minimal loading indicator if desired
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-[400px]">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">
            {isValidSession ? "Payment Successful!" : "Payment Status"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {message ? (
            <p className="text-gray-600 text-center">{message}</p>
          ) : null}
          {isValidSession ? (
            <Button asChild className="w-full bg-[#10B981] hover:bg-[#10B981]/90 text-white">
              <Link href="/dashboard">Go to Dashboard</Link>
            </Button>
          ) : (
            <Button asChild variant="outline" className="w-full">
              <Link href="/pricing">Return to Pricing</Link>
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
