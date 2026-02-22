import { Link } from "react-router-dom"
import { CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function SignUpSuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md border-border/50 shadow-lg">
        <CardHeader className="text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
            <CheckCircle2 className="h-7 w-7 text-primary" />
          </div>
          <CardTitle className="text-2xl">Account Created</CardTitle>
          <CardDescription>You can now sign in and start using CareerLens.</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <Link to="/auth/login">
            <Button>Go to Sign In</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}

