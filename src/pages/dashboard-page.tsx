import { useEffect, useMemo, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import {
  ArrowUpRight,
  BarChart3,
  CheckCircle2,
  FileText,
  LogOut,
  Sparkles,
  Target,
  UserRound,
} from "lucide-react"
import { getClientSession, signOut } from "@/lib/auth/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface DashboardMetric {
  label: string
  value: string
  hint: string
  icon: typeof FileText
}

export function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [fullName, setFullName] = useState("there")
  const navigate = useNavigate()

  useEffect(() => {
    const hydrateSession = async () => {
      const session = await getClientSession()
      if (!session.user) {
        navigate("/auth/login", { replace: true })
        return
      }

      if (session.profile?.full_name) {
        setFullName(session.profile.full_name)
      }

      setIsLoading(false)
    }

    hydrateSession()
  }, [navigate])

  const metrics = useMemo<DashboardMetric[]>(
    () => [
      { label: "Resume Score", value: "78%", hint: "+12 this week", icon: FileText },
      { label: "Portfolio Score", value: "71%", hint: "+8 this week", icon: Target },
      { label: "Skills Matched", value: "24", hint: "for top roles", icon: CheckCircle2 },
      { label: "Applications Ready", value: "6", hint: "profiles optimized", icon: BarChart3 },
    ],
    [],
  )

  const handleSignOut = async () => {
    await signOut()
    navigate("/auth/login", { replace: true })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-lg font-semibold">Loading your dashboard...</p>
          <p className="text-sm text-muted-foreground mt-1">Preparing your latest insights</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-6xl px-4 py-8 md:px-6 md:py-10">
        <header className="relative overflow-hidden rounded-2xl border border-border/60 bg-card p-6 shadow-sm md:p-8">
          <div className="absolute -right-8 -top-10 h-36 w-36 rounded-full bg-primary/20 blur-2xl" />
          <div className="absolute -left-10 -bottom-12 h-36 w-36 rounded-full bg-chart-2/20 blur-2xl" />

          <div className="relative flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Welcome back</p>
              <h1 className="text-3xl font-bold tracking-tight font-display">Hi, {fullName}</h1>
              <p className="mt-2 text-muted-foreground">
                Track progress, improve your profile, and stay interview-ready.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button asChild variant="outline">
                <Link to="/">
                  View Site
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button onClick={handleSignOut} variant="destructive">
                <LogOut className="h-4 w-4" />
                Sign out
              </Button>
            </div>
          </div>
        </header>

        <section className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {metrics.map((item) => {
            const Icon = item.icon
            return (
              <Card key={item.label} className="border-border/60">
                <CardHeader className="flex-row items-center justify-between space-y-0">
                  <CardDescription>{item.label}</CardDescription>
                  <Icon className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold tracking-tight">{item.value}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{item.hint}</p>
                </CardContent>
              </Card>
            )
          })}
        </section>

        <section className="mt-6 grid gap-4 lg:grid-cols-3">
          <Card className="lg:col-span-2 border-border/60">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Profile Completion
              </CardTitle>
              <CardDescription>Focus on these areas for the biggest impact.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span>Resume Strength</span>
                  <span className="text-muted-foreground">78%</span>
                </div>
                <Progress value={78} />
              </div>
              <div>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span>Portfolio Presence</span>
                  <span className="text-muted-foreground">71%</span>
                </div>
                <Progress value={71} />
              </div>
              <div>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span>ATS Readiness</span>
                  <span className="text-muted-foreground">84%</span>
                </div>
                <Progress value={84} />
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/60">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserRound className="h-5 w-5 text-primary" />
                Next Actions
              </CardTitle>
              <CardDescription>Complete these to increase interview chances.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="rounded-lg border border-border/60 bg-muted/30 p-3">
                Add 3 quantified achievements to your work experience section.
              </div>
              <div className="rounded-lg border border-border/60 bg-muted/30 p-3">
                Improve portfolio headline with role + value proposition.
              </div>
              <div className="rounded-lg border border-border/60 bg-muted/30 p-3">
                Tailor keywords for Product Analyst and Data Analyst jobs.
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  )
}
