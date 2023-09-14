import { createBrowserRouter, RouterProvider } from "react-router-dom";

import PrivateLayout from "@templates/PrivateLayout";
import LoginPage from "@pages/Login";
import QueuePublic from "@pages/QueuePublic";
import QueueAdmin from "@pages/Admin";

import { APP_URLS } from "@routes";

import "./App.css";

const routesConfig = [
  {
    path: APP_URLS.login,
    element: <LoginPage />,
  },
  {
    path: APP_URLS.queue,
    element: <QueuePublic />,
  },
  {
    element: <PrivateLayout />,
    children: [
      {
        path: APP_URLS.admin,
        element: <QueueAdmin />,
      },
    ],
  },
];

const router = createBrowserRouter(routesConfig);

function App() {
  return (
    <div className="App">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
