import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App";
import EmployeeList from "./pages/EmployeeList";
import CreateEmployee from "./pages/CreateEmployee";

const router = createBrowserRouter([
  {
    element: <App />,
    errorElement: <div>404 Not Found</div>,
    children: [
      {
        path: "/",
        //redirect to create employee page
        loader: () => {
          return window.location.replace("/create-employee");
        },
      },
      {
        path: "/create-employee",
        element: <CreateEmployee />,
      },
      {
        path: "/employee-list",
        element: <EmployeeList />,
      },
    ],
  },
]);

export default function Router() {
  return <RouterProvider router={router} />;
}
