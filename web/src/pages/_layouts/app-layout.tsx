import { Outlet } from "react-router-dom";

export function AppLayout() {
  return (
    <div className="min-h-screen flex flex-col px-3 py-8 justify-center items-center md:py-20">
      <Outlet />
    </div>
  )
}