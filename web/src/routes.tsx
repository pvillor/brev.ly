import { createBrowserRouter } from "react-router-dom";
import { AppLayout } from "./pages/_layouts/app-layout";
import { Links } from "./pages/links";
import { Redirect } from "./pages/redirect";
import { NotFound } from "./pages/not-found";

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    errorElement: <NotFound />,
    children: [
      { 
        path: '/', 
        element: <Links />
      },
      { 
        path: '/:shortUrlSuffix', 
        element: <Redirect />
      },
    ]
  }
])