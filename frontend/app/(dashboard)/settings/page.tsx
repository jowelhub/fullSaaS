"use client"

import { useSession } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Loading from "@/components/loading"

export default function SettingsPage() {
  const { data: session, status } = useSession()

  if (status === "loading") {
    return <Loading />
  }

  return (
    <div className="grid gap-6">
      <h1 className="text-3xl font-bold">Settings</h1>
      <Card>
        <CardHeader>
          <CardTitle>Account Settings</CardTitle>
          <CardDescription>Manage your account settings and preferences</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">Email: {session?.user?.email}</p>
          <p className="text-gray-600 mt-4">More account settings and preferences will be available here soon.</p>
        </CardContent>
      </Card>
    </div>
  )
}
