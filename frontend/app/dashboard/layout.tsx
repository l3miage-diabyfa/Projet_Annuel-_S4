import React, { ReactNode } from "react";
import AdminNavbar from "./components/AdminNavbar";

type LayoutProps = {
  children: ReactNode;
};

export default function DashboardLayout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background pt-30 p-4">
      {/* Header */}
      <AdminNavbar />
      {children}
    </div>
  );
}
