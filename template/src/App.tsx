import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { lazy, Suspense, ComponentType } from "react";

const pages = import.meta.glob("./pages/**/*.tsx");

const routes = Object.entries(pages).map(([path, component]) => {
  const routePath = path
    .replace(/\.\/pages\//i, "")
    .replace(/\.tsx$/i, "")
    .replace(/\/index$/i, "")
    .replace(/\[(\w+)\]/g, ":$1");

  const Component = lazy(
    component as unknown as () => Promise<{ default: ComponentType }>
  );

  return {
    path: routePath === "index" ? "/" : `/${routePath}`,
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <Component />
      </Suspense>
    ),
  };
});

const router = createBrowserRouter(routes);

export default function App() {
  return <RouterProvider router={router} />;
}
