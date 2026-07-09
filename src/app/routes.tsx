import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { Dashboard } from "./components/Dashboard";
import { Clients } from "./components/Clients";
import { WorkOrders } from "./components/WorkOrders";
import { Budgets } from "./components/Budgets";
import { Invoices } from "./components/Invoices";
import { Stock } from "./components/Stock";
import { Reports } from "./components/Reports";
import { Login } from "./components/Login";
import { Register } from "./components/Register";
import { Papelera } from "./components/Papelera";
import { Settings } from "./components/Settings";
import { UserManagement } from "./components/UserManagement";
import { Calendario } from "./components/Calendario";

export const router = createBrowserRouter([
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/register",
    Component: Register,
  },
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Dashboard },
      { path: "clientes", Component: Clients },
      { path: "ordenes", Component: WorkOrders },
      { path: "presupuestos", Component: Budgets },
      { path: "calendario", Component: Calendario },
      { path: "cobranzas", Component: Invoices },
      { path: "stock", Component: Stock },
      { path: "reportes", Component: Reports },
      { path: "papelera", Component: Papelera },
      { path: "configuracion", Component: Settings },
      { path: "usuarios", Component: UserManagement },
    ],
  },
]);