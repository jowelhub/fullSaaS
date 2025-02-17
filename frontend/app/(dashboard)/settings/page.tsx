"use client";

import { useSession } from "next-auth/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Loading from "@/components/loading";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

interface Subscription {
  plan_name: string;
  current_period_end: string;
  status: string;
}

interface User {
  email: string;
  name: string;
}

export default function SettingsPage() {
  const { data: session, status } = useSession();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [isEditingName, setIsEditingName] = useState(false);

  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/users/mysubscription/`, {
          headers: {
            Authorization: `Bearer ${session?.accessToken}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setSubscription(data);
        } else if (response.status === 404) {
          // No active subscription
          setSubscription(null);
        } else {
          console.error("Error fetching subscription:", response);
        }
      } catch (error) {
        console.error("Error fetching subscription:", error);
      }
    };

    const fetchUser = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/users/me/`, {
          headers: {
            Authorization: `Bearer ${session?.accessToken}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data);
          setName(data.name);
        } else {
          console.error("Error fetching user:", response);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    };

    if (session?.accessToken) {
      fetchSubscription();
      fetchUser();
    }
  }, [session?.accessToken]);

  const handleUpdateName = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/users/me/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.accessToken}`,
        },
        body: JSON.stringify({ name: name }),
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data);
        setIsEditingName(false);
      } else {
        console.error("Error updating name:", response);
      }
    } catch (error) {
      console.error("Error updating name:", error);
    }
  };

  if (status === "loading" || loading) {
    return <Loading />;
  }

  return (
    <div className="grid gap-6">
      <h1 className="text-3xl font-bold">Settings</h1>

      {/* Account Settings Section */}
      <Card>
        <CardHeader>
          <CardTitle>Account Settings</CardTitle>
          <CardDescription>Manage your account settings and preferences</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Email:
            </label>
            <p className="text-gray-600">{user?.email}</p>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">
              Name:
            </label>
            {isEditingName ? (
              <div className="flex space-x-2">
                <input
                  type="text"
                  id="name"
                  className="shadow-sm focus:ring-[#10B981] focus:border-[#10B981] block w-full sm:text-sm border-gray-300 rounded-md"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <Button variant="outline" size="sm" onClick={handleUpdateName}>
                  Save
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setIsEditingName(false)}>
                  Cancel
                </Button>
              </div>
            ) : (
              <div className="flex justify-between items-center">
                <p className="text-gray-600">{user?.name}</p>
                <Button variant="outline" size="sm" onClick={() => setIsEditingName(true)}>
                  Edit
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Subscription Section */}
      <Card>
        <CardHeader>
          <CardTitle>Subscription</CardTitle>
          <CardDescription>Your current subscription details</CardDescription>
        </CardHeader>
        <CardContent>
          {subscription && subscription.status === "active" ? (
            <>
              <div className="mb-2">
                <label className="block text-sm font-medium text-gray-700">Plan:</label>
                <p className="text-gray-600">{subscription.plan_name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Current Period End:</label>
                <p className="text-gray-600">
                  {new Date(subscription.current_period_end).toLocaleDateString()}
                </p>
              </div>
            </>
          ) : (
            <p className="text-gray-600">You do not have an active subscription.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
