import { Navigate, Route, Routes } from "react-router-dom"
import { LandingPage } from "@/src/pages/landing-page"
import { LoginPage } from "@/src/pages/login-page"
import { SignUpPage } from "@/src/pages/sign-up-page"
import { SignUpSuccessPage } from "@/src/pages/sign-up-success-page"
import { DashboardPage } from "@/src/pages/dashboard-page"

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/auth/login" element={<LoginPage />} />
      <Route path="/auth/sign-up" element={<SignUpPage />} />
      <Route path="/auth/sign-up-success" element={<SignUpSuccessPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
