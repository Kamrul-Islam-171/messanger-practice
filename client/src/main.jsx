import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./components/Login.jsx";
import Chat from "./components/Chat.jsx";
import ChatProvider from "./Context/ChatProvider.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/chat",
    element: <Chat />,
  },
]);

createRoot(document.getElementById("root")).render(
  <>
    <ChatProvider>
      <RouterProvider router={router} />
    </ChatProvider>
  </>
);
