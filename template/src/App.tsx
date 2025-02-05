import { RouterProvider } from "react-router-dom";
import { router } from "../.revine/routing/fileBased";

export default function App() {
  return <RouterProvider router={router} />;
}
