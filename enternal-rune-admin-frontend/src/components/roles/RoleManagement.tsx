"use client";
import React, { useState } from "react";
import Badge from "@/components/ui/badge/Badge";

type Permission = {
  id: string;
  name: string;
  description: string;
  category: string;
};

type Role = {
  id: string;
  name: string;
  description: string;
  color: string;
  usersCount: number;
  status: "active" | "inactive";
  permissions: string[];
  isSystem: boolean;
  createdAt: string;
};

// Mock permissions data
const permissionsData: Permission[] = [
  // Product permissions
  { id: "product.view", name: "Xem sản phẩm", description: "Xem danh sách và chi tiết sản phẩm", category: "Sản phẩm" },
  { id: "product.create", name: "Tạo sản phẩm", description: "Thêm sản phẩm mới", category: "Sản phẩm" },
  { id: "product.edit", name: "Sửa sản phẩm", description: "Chỉnh sửa thông tin sản phẩm", category: "Sản phẩm" },
  { id: "product.delete", name: "Xóa sản phẩm", description: "Xóa sản phẩm khỏi hệ thống", category: "Sản phẩm" },
  
  // Order permissions
  { id: "order.view", name: "Xem đơn hàng", description: "Xem danh sách và chi tiết đơn hàng", category: "Đơn hàng" },
  { id: "order.process", name: "Xử lý đơn hàng", description: "Cập nhật trạng thái đơn hàng", category: "Đơn hàng" },
  { id: "order.cancel", name: "Hủy đơn hàng", description: "Hủy đơn hàng", category: "Đơn hàng" },
  { id: "order.refund", name: "Hoàn tiền", description: "Xử lý hoàn tiền cho khách hàng", category: "Đơn hàng" },
  
  // Customer permissions
  { id: "customer.view", name: "Xem khách hàng", description: "Xem thông tin khách hàng", category: "Khách hàng" },
  { id: "customer.edit", name: "Sửa khách hàng", description: "Chỉnh sửa thông tin khách hàng", category: "Khách hàng" },
  { id: "customer.delete", name: "Xóa khách hàng", description: "Xóa tài khoản khách hàng", category: "Khách hàng" },
  
  // Staff permissions
  { id: "staff.view", name: "Xem nhân viên", description: "Xem danh sách nhân viên", category: "Nhân viên" },
  { id: "staff.create", name: "Tạo nhân viên", description: "Thêm nhân viên mới", category: "Nhân viên" },
  { id: "staff.edit", name: "Sửa nhân viên", description: "Chỉnh sửa thông tin nhân viên", category: "Nhân viên" },
  { id: "staff.delete", name: "Xóa nhân viên", description: "Xóa nhân viên", category: "Nhân viên" },
  
  // Role permissions
  { id: "role.view", name: "Xem vai trò", description: "Xem danh sách vai trò", category: "Phân quyền" },
  { id: "role.create", name: "Tạo vai trò", description: "Tạo vai trò mới", category: "Phân quyền" },
  { id: "role.edit", name: "Sửa vai trò", description: "Chỉnh sửa vai trò", category: "Phân quyền" },
  { id: "role.delete", name: "Xóa vai trò", description: "Xóa vai trò", category: "Phân quyền" },
  
  // Report permissions
  { id: "report.view", name: "Xem báo cáo", description: "Xem các báo cáo thống kê", category: "Báo cáo" },
  { id: "report.export", name: "Xuất báo cáo", description: "Xuất báo cáo ra file", category: "Báo cáo" },
  
  // Settings permissions
  { id: "settings.view", name: "Xem cấu hình", description: "Xem cấu hình hệ thống", category: "Cài đặt" },
  { id: "settings.edit", name: "Sửa cấu hình", description: "Thay đổi cấu hình hệ thống", category: "Cài đặt" },
];

// Mock roles data
const rolesData: Role[] = [
  {
    id: "1",
    name: "Quản trị viên",
    description: "Toàn quyền quản lý hệ thống",
    color: "bg-red-500",
    usersCount: 3,
    status: "active",
    permissions: permissionsData.map(p => p.id),
    isSystem: true,
    createdAt: "2024-01-01",
  },
  {
    id: "2",
    name: "Quản lý",
    description: "Quản lý sản phẩm, đơn hàng và nhân viên",
    color: "bg-blue-500",
    usersCount: 8,
    status: "active",
    permissions: [
      "product.view", "product.create", "product.edit",
      "order.view", "order.process", "order.cancel",
      "customer.view", "customer.edit",
      "staff.view",
      "report.view", "report.export",
    ],
    isSystem: false,
    createdAt: "2024-01-05",
  },
  {
    id: "3",
    name: "Nhân viên bán hàng",
    description: "Xử lý đơn hàng và tương tác khách hàng",
    color: "bg-green-500",
    usersCount: 45,
    status: "active",
    permissions: [
      "product.view",
      "order.view", "order.process",
      "customer.view", "customer.edit",
    ],
    isSystem: false,
    createdAt: "2024-01-10",
  },
  {
    id: "4",
    name: "Nhân viên kho",
    description: "Quản lý kho và sản phẩm",
    color: "bg-purple-500",
    usersCount: 12,
    status: "active",
    permissions: [
      "product.view", "product.create", "product.edit",
      "order.view",
    ],
    isSystem: false,
    createdAt: "2024-01-15",
  },
  {
    id: "5",
    name: "Hỗ trợ khách hàng",
    description: "Hỗ trợ và chăm sóc khách hàng",
    color: "bg-yellow-500",
    usersCount: 18,
    status: "active",
    permissions: [
      "product.view",
      "order.view",
      "customer.view", "customer.edit",
    ],
    isSystem: false,
    createdAt: "2024-01-20",
  },
  {
    id: "6",
    name: "Kế toán",
    description: "Quản lý tài chính và báo cáo",
    color: "bg-indigo-500",
    usersCount: 5,
    status: "active",
    permissions: [
      "order.view", "order.refund",
      "report.view", "report.export",
    ],
    isSystem: false,
    createdAt: "2024-01-25",
  },
  {
    id: "7",
    name: "Marketing",
    description: "Quản lý nội dung và khuyến mãi",
    color: "bg-pink-500",
    usersCount: 7,
    status: "active",
    permissions: [
      "product.view", "product.edit",
      "customer.view",
      "report.view",
    ],
    isSystem: false,
    createdAt: "2024-02-01",
  },
  {
    id: "8",
    name: "Chỉ xem",
    description: "Chỉ có quyền xem, không sửa đổi",
    color: "bg-gray-500",
    usersCount: 26,
    status: "active",
    permissions: [
      "product.view",
      "order.view",
      "customer.view",
      "staff.view",
      "report.view",
    ],
    isSystem: false,
    createdAt: "2024-02-05",
  },
];

export default function RoleManagement() {
  const [selectedRole, setSelectedRole] = useState<Role | null>(rolesData[0]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [editingPermissions, setEditingPermissions] = useState<Set<string>>(
    new Set(rolesData[0].permissions)
  );

  // Group permissions by category
  const permissionsByCategory = permissionsData.reduce((acc, permission) => {
    if (!acc[permission.category]) {
      acc[permission.category] = [];
    }
    acc[permission.category].push(permission);
    return acc;
  }, {} as Record<string, Permission[]>);

  const handleRoleSelect = (role: Role) => {
    setSelectedRole(role);
    setEditingPermissions(new Set(role.permissions));
    setIsCreating(false);
  };

  const handlePermissionToggle = (permissionId: string) => {
    if (selectedRole?.isSystem) return; // Can't edit system roles
    
    setEditingPermissions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(permissionId)) {
        newSet.delete(permissionId);
      } else {
        newSet.add(permissionId);
      }
      return newSet;
    });
  };

  const handleSelectAllInCategory = (category: string) => {
    if (selectedRole?.isSystem) return;
    
    const categoryPermissions = permissionsByCategory[category].map(p => p.id);
    const allSelected = categoryPermissions.every(id => editingPermissions.has(id));
    
    setEditingPermissions(prev => {
      const newSet = new Set(prev);
      categoryPermissions.forEach(id => {
        if (allSelected) {
          newSet.delete(id);
        } else {
          newSet.add(id);
        }
      });
      return newSet;
    });
  };

  const filteredRoles = rolesData.filter(role =>
    role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    role.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadgeColor = (status: string): "success" | "error" => {
    return status === "active" ? "success" : "error";
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
      {/* Left Panel - Roles List */}
      <div className="lg:col-span-4">
        <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
          {/* Header */}
          <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-800">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                Danh sách vai trò
              </h3>
              <button
                onClick={() => setIsCreating(true)}
                className="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-3 py-2 text-sm font-medium text-white hover:bg-brand-600 dark:bg-brand-600 dark:hover:bg-brand-700"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Tạo vai trò
              </button>
            </div>

            {/* Search */}
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm kiếm vai trò..."
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 pl-10 text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
              <svg
                className="absolute left-3 top-1/2 w-4 h-4 -translate-y-1/2 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>

          {/* Roles List */}
          <div className="max-h-[600px] overflow-y-auto p-4">
            <div className="space-y-2">
              {filteredRoles.map((role) => (
                <button
                  key={role.id}
                  onClick={() => handleRoleSelect(role)}
                  className={`w-full rounded-lg border p-4 text-left transition-all ${
                    selectedRole?.id === role.id
                      ? "border-brand-500 bg-brand-50 dark:border-brand-600 dark:bg-brand-900/20"
                      : "border-gray-200 bg-white hover:border-gray-300 dark:border-gray-800 dark:bg-white/[0.03] dark:hover:border-gray-700"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 flex-1">
                      {/* <div className={`w-10 h-10 rounded-lg ${role.color} flex items-center justify-center flex-shrink-0`}>
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                      </div> */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-gray-900 dark:text-white truncate">
                            {role.name}
                          </h4>
                          {role.isSystem && (
                            <Badge color="warning" size="sm">Hệ thống</Badge>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-2">
                          {role.description}
                        </p>
                        <div className="flex items-center gap-3 text-xs">
                          <span className="text-gray-500 dark:text-gray-400">
                            <svg className="w-3.5 h-3.5 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                            {role.usersCount} người
                          </span>
                          <Badge color={getStatusBadgeColor(role.status)} size="sm">
                            {role.status === "active" ? "Hoạt động" : "Tạm khóa"}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Permissions */}
      <div className="lg:col-span-8">
        <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
          {selectedRole ? (
            <>
              {/* Header */}
              <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-800">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex items-start gap-4">
                    {/* <div className={`w-14 h-14 rounded-xl ${selectedRole.color} flex items-center justify-center flex-shrink-0`}>
                      <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div> */}
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                          {selectedRole.name}
                        </h3>
                        {selectedRole.isSystem && (
                          <Badge color="warning">Hệ thống</Badge>
                        )}
                        <Badge color={getStatusBadgeColor(selectedRole.status)}>
                          {selectedRole.status === "active" ? "Hoạt động" : "Tạm khóa"}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                        {selectedRole.description}
                      </p>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-gray-600 dark:text-gray-400">
                          <svg className="w-4 h-4 inline mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                          </svg>
                          {selectedRole.usersCount} nhân viên
                        </span>
                        <span className="text-gray-600 dark:text-gray-400">
                          <svg className="w-4 h-4 inline mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                          </svg>
                          {editingPermissions.size} quyền
                        </span>
                      </div>
                    </div>
                  </div>
                  {!selectedRole.isSystem && (
                    <div className="flex items-center gap-2">
                      <button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-white/[0.03]">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Chỉnh sửa
                      </button>
                      <button className="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600 dark:bg-brand-600 dark:hover:bg-brand-700">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Lưu thay đổi
                      </button>
                    </div>
                  )}
                </div>

                {selectedRole.isSystem && (
                  <div className="rounded-lg bg-yellow-50 p-3 dark:bg-yellow-900/20">
                    <div className="flex items-start gap-2">
                      <svg className="w-5 h-5 text-yellow-600 dark:text-yellow-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      <p className="text-sm text-yellow-800 dark:text-yellow-200">
                        Đây là vai trò hệ thống, không thể chỉnh sửa quyền hạn. Bạn có thể xem để tham khảo.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Permissions */}
              <div className="p-6">
                <h4 className="text-base font-semibold text-gray-900 dark:text-white mb-4">
                  Phân quyền chi tiết
                </h4>
                <div className="space-y-6">
                  {Object.entries(permissionsByCategory).map(([category, permissions]) => {
                    const allSelected = permissions.every(p => editingPermissions.has(p.id));
                    const someSelected = permissions.some(p => editingPermissions.has(p.id));
                    
                    return (
                      <div key={category} className="rounded-xl border border-gray-200 dark:border-gray-800">
                        {/* Category Header */}
                        <div className="border-b border-gray-200 bg-gray-50 px-4 py-3 dark:border-gray-800 dark:bg-gray-800/50">
                          <div className="flex items-center justify-between">
                            <h5 className="font-medium text-gray-900 dark:text-white">
                              {category}
                            </h5>
                            {!selectedRole.isSystem && (
                              <button
                                onClick={() => handleSelectAllInCategory(category)}
                                className="text-sm font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300"
                              >
                                {allSelected ? "Bỏ chọn tất cả" : "Chọn tất cả"}
                              </button>
                            )}
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {permissions.filter(p => editingPermissions.has(p.id)).length} / {permissions.length} quyền được chọn
                          </p>
                        </div>

                        {/* Permissions List */}
                        <div className="p-4 space-y-3">
                          {permissions.map((permission) => {
                            const isChecked = editingPermissions.has(permission.id);
                            
                            return (
                              <label
                                key={permission.id}
                                className={`flex items-start gap-3 rounded-lg border p-3 cursor-pointer transition-colors ${
                                  isChecked
                                    ? "border-brand-500 bg-brand-50 dark:border-brand-600 dark:bg-brand-900/20"
                                    : "border-gray-200 hover:border-gray-300 dark:border-gray-800 dark:hover:border-gray-700"
                                } ${selectedRole.isSystem ? "opacity-75 cursor-not-allowed" : ""}`}
                              >
                                <input
                                  type="checkbox"
                                  checked={isChecked}
                                  onChange={() => handlePermissionToggle(permission.id)}
                                  disabled={selectedRole.isSystem}
                                  className="mt-0.5 w-4 h-4 text-brand-600 bg-gray-100 border-gray-300 rounded focus:ring-brand-500 dark:bg-gray-800 dark:border-gray-600 disabled:opacity-50"
                                />
                                <div className="flex-1 min-w-0">
                                  <div className="font-medium text-gray-900 dark:text-white text-sm">
                                    {permission.name}
                                  </div>
                                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                    {permission.description}
                                  </p>
                                  <code className="text-xs text-gray-400 dark:text-gray-600 mt-1 inline-block">
                                    {permission.id}
                                  </code>
                                </div>
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-20">
              <svg className="w-20 h-20 text-gray-400 dark:text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Chọn một vai trò
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Chọn vai trò từ danh sách bên trái để xem và chỉnh sửa quyền hạn
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
