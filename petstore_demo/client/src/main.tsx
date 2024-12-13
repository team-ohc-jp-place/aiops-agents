import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Switch, Route } from "wouter";
import "./index.css";
import { SWRConfig } from "swr";
import { fetcher } from "./lib/fetcher";
import { Toaster } from "@/components/ui/toaster";
import { Navbar } from "@/components/Navbar";
import { Home } from "./pages/Home";
import { Shop } from "./pages/Shop";
import { PetDetail } from "./pages/PetDetail";
import { Cart } from "./pages/Cart";
import { Admin } from "./pages/Admin";
import { Profile } from "./pages/Profile";
import { Login } from "./pages/Login";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <SWRConfig value={{ fetcher }}>
      <Navbar />
      <main className="min-h-screen bg-background">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/shop" component={Shop} />
          <Route path="/pet/:id" component={PetDetail} />
          <Route path="/cart" component={Cart} />
          <Route path="/admin" component={Admin} />
          <Route path="/profile" component={Profile} />
          <Route path="/login" component={Login} />
          <Route>404 Page Not Found</Route>
        </Switch>
      </main>
      <Toaster />
    </SWRConfig>
  </StrictMode>
);
