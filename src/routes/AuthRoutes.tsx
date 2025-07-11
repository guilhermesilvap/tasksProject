import { Route, Routes } from "react-router";
import { NotFound } from "../components/Pages/NotFound/index.tsx";

import { SignUp } from "../components/Pages/Cadastro";
import { Login } from "../components/Pages/Login/index.tsx";

export function AuthRoutes(){
    return(
        <Routes>
             <Route path="/" element={<Login/>}></Route>
             <Route path="/register" element={<SignUp/>}></Route>
             <Route path="*" element={<NotFound/>}></Route>
        </Routes>
    )
}