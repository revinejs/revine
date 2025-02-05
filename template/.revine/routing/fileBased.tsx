import { createBrowserRouter } from "react-router-dom";
import { lazy, Suspense, ComponentType } from "react";

const pages = import.meta.glob("../../src/pages/**/*.tsx");

const routes = Object.entries(pages).map(([filePath, component]) => {
  let cleaned = filePath.replace(/\\/g, "/");

  cleaned = cleaned.replace(/.*\/pages\//, "");

  cleaned = cleaned.replace(/\.tsx$/i, "");

  cleaned = cleaned.replace(/\/index$/, "");

  cleaned = cleaned.replace(/\[(\w+)\]/g, ":$1");

  if (cleaned === "index") {
    cleaned = "";
  }

  // 6. Route path is empty for index => "/"
  const routePath = cleaned === "" ? "/" : `/${cleaned}`;

  const Component = lazy(
    component as unknown as () => Promise<{ default: ComponentType }>
  );

  return {
    path: routePath,
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <Component />
      </Suspense>
    ),
  };
});

export const router = createBrowserRouter(routes);
