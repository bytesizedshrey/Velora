import { createBrowserRouter, Outlet, useLocation } from "react-router";

import Register from "./features/auth/pages/Register";
import Login from "./features/auth/pages/Login";
import Home from "./features/products/pages/Home";
import CreateProduct from "./features/products/pages/CreateProduct";
import Dashboard from "./features/products/pages/Dashboard";
import ProductDetail from "./features/products/pages/ProductDetail";

import Protected from "./features/auth/components/Protected";
import useLenis from "../shared/hooks/useLenis";
import { NotchNavbar } from "../components/ui/notch-navbar";
import SellerProductDetails from "./features/products/pages/SellerProductDetails";

const NO_SCROLL_ROUTES = ["/register", "/login", "/forgot-password"];

const RootLayout = () => {
  const { pathname } = useLocation();

  const isAuthPage = NO_SCROLL_ROUTES.some((route) =>
    pathname.startsWith(route)
  );

  useLenis(isAuthPage);

  return (
    <>
      {!isAuthPage && <NotchNavbar />}

      <main
        className={`min-h-screen bg-[#040404] ${
          !isAuthPage ? "pt-28" : ""
        }`}
      >
        <Outlet />
      </main>
    </>
  );
};

const SellerLayout = () => (
  <Protected role="seller">
    <Outlet />
  </Protected>
);

export const routes = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "product/:productId",
        element: <ProductDetail />,
      },
      {
        path: "register",
        element: <Register />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "seller",
        element: <SellerLayout />,
        children: [
          {
            path: "create-product",
            element: <CreateProduct />,
          },
          {
            path: "dashboard",
            element: <Dashboard />,
          },
          {
            path: "product/:productId",
            element: <SellerProductDetails />,
          },
        ],
      },
    ],
  },
]);