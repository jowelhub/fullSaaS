"use client"

import { useSession } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Loading from "@/components/loading"

export default function DashboardPage() {
  const { data: session, status } = useSession()

  if (status === "loading") {
    return <Loading />
  }

  return (
    <div className="grid gap-6">
      <h1 className="text-3xl font-bold">Welcome, {session?.user?.name}</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Projects</CardTitle>
            <CardDescription>Your active projects</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">3</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Storage</CardTitle>
            <CardDescription>Storage usage</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">45%</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Users</CardTitle>
            <CardDescription>Active users</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">1,234</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
