import React from "react";
import PageBreadCrumb from "@/components/common/PageBreadCrumb";
import { RoleMetrics, RoleManagement } from "@/components/roles";

export default function RolesPage() {
  return (
    <div className="mx-auto max-w-screen-2xl space-y-6 p-4 md:p-6 2xl:p-10">
      {/* Breadcrumb */}
      <PageBreadCrumb pageTitle="Phân quyền" />

      {/* Metrics */}
      {/* <RoleMetrics /> */}

      {/* Role Management */}
      <RoleManagement />
    </div>
  );
}
