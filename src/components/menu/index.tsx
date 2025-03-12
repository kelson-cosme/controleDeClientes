import {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { Link, useLocation } from "react-router-dom";

function Menu() {
  const location = useLocation();

  return (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger
          className={`w-full ${location.pathname === "/" ? "bg-black text-white" : ""}`}
        >
          <Link className="w-full h-full flex items-center justify-center" to={"/"}>
            Dashboard
          </Link>
        </MenubarTrigger>
        <MenubarTrigger
          className={`w-full ${location.pathname === "/lancamentos" ? "bg-black text-white" : ""}`}
        >
          <Link className="w-full h-full flex items-center justify-center" to={"/lancamentos"}>
            Lançamentos
          </Link>
        </MenubarTrigger>
      </MenubarMenu>
    </Menubar>
  );
}

export default Menu;
