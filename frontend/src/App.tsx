import { Outlet } from "react-router-dom";

/**
 * Root route element. Global providers (Redux, TanStack Query, Theme)
 * are wired up in main.tsx around <RouterProvider />, so this component
 * just needs to render the active branch of the route tree.
 */
function App() {
  return <Outlet />;
}

export default App;
