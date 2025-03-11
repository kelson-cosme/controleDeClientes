import {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar"

import { Link } from "react-router-dom"


  function Menu(){
    return(
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger className="w-full "><Link className="w-full" to={"/"}>Dashboard</Link></MenubarTrigger>
          <MenubarTrigger className="w-full "><Link className="w-full" to={"/lancamentos"}>Lançamentos</Link></MenubarTrigger>
          

        </MenubarMenu>
      </Menubar>

    )
  }

  export default Menu
