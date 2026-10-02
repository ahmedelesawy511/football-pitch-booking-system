import { Routes, Route, Link, Router } from "react-router-dom";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { cn } from "cn";

export default function App() {
  return (
    <>
      <div className="border-x-2 min-h-dvh max-w-230 w-96/100 m-auto">
        <header className="w-full px-4 border-b-2">
          <NavigationMenu className={"min-h-16 w-full max-w-full"}>
            <NavigationMenuList className={"w-full justify-end"}>
              <NavigationMenuItem className={"mr-auto"}>
                <NavigationMenuLink
                  className={"text-2xl font-semibold hover:bg-transparent"}
                  render={<Link to={"/"} />}
                >
                  FPBS
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink render={<Link to={"/dashboard"} />}>
                  Dashboard
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </header>
        <main className="border-b-2 p-5 sm:p-7 md:p-10">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </main>
      </div>
    </>
  );
}
