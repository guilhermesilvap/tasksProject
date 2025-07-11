import { Routes, Route } from "react-router";
import { NotFound } from "../components/Pages/NotFound";
import { ListTasks } from "../components/Pages/Dashboard";
import { Navigate } from "react-router";
export function DashboardRoutes(){
    return(
        <Routes>
            <Route path="/dashboard" element={<ListTasks/>}></Route>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<NotFound/>}></Route>
        </Routes>
    )
}