import { BrowserRouter, Routes, Route } from "react-router-dom"
// import Home from "../pages/home/Home"
import Dashboard from "../pages/dashboard/Dashboard"
import Lancamentos from "../pages/lancamentos/Lancamentos"
import Menu from "@/components/menu";

function Rotas() {

  return (
    <>
      <BrowserRouter>
        <Menu/>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/lancamentos" element={<Lancamentos />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default Rotas