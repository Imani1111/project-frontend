import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div className="page-wrapper">
      <Outlet />
    </div>
  );
}