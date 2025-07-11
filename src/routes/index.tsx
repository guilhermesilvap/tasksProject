import { BrowserRouter } from "react-router"
import { useAuth } from "../hooks/useAuth"
import { AuthRoutes } from "./AuthRoutes"
import { DashboardRoutes } from "./DashboardRoutes"

export function Routes() {
  const { session } = useAuth()

  return (
    <BrowserRouter>
      {session ? <DashboardRoutes /> : <AuthRoutes/>}
    </BrowserRouter>
  )
}
