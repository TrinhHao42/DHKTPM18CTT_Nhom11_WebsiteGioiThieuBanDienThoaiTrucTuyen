import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";
import Image from "next/image";
import { RecentOrderData } from "@/types/dashboard";
import { useRouter } from "next/dist/client/components/navigation";

interface RecentOrdersProps {
  data?: RecentOrderData[];
  loading?: boolean;
}

export default function RecentOrders({ data, loading }: RecentOrdersProps) {
  const router = useRouter();
  const orders = data || [];

  const getStatusColor = (status: string): "success" | "warning" | "error" => {
    const statusLower = status.toLowerCase();
    if (statusLower.includes("deliver") || statusLower.includes("giao")) return "success";
    if (statusLower.includes("cancel") || statusLower.includes("hủy") || statusLower.includes("refund")) return "error";
    return "warning";
  };
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
      <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Đơn hàng gần đây
          </h3>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={() => router.push("/orders")} className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200">
            Xem tất cả
          </button>
        </div>
      </div>
      <div className="max-w-full overflow-x-auto">
        <Table>
          {/* Table Header */}
          <TableHeader className="border-gray-100 dark:border-gray-800 border-y">
            <TableRow>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Sản phẩm
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Danh mục
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Giá
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Trạng thái
              </TableCell>
            </TableRow>
          </TableHeader>

          {/* Table Body */}

          <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i} className="animate-pulse">
                  <TableCell className="py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 bg-gray-200 rounded-md dark:bg-gray-700" />
                      <div className="h-4 bg-gray-200 rounded dark:bg-gray-700 w-32" />
                    </div>
                  </TableCell>
                  <TableCell><div className="h-4 bg-gray-200 rounded dark:bg-gray-700 w-20" /></TableCell>
                  <TableCell><div className="h-4 bg-gray-200 rounded dark:bg-gray-700 w-24" /></TableCell>
                  <TableCell><div className="h-4 bg-gray-200 rounded dark:bg-gray-700 w-16" /></TableCell>
                </TableRow>
              ))
            ) : orders.length > 0 ? (
              orders.map((order) => (
                <TableRow key={order.orderId} className="">
                  <TableCell className="py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-[50px] w-[50px] overflow-hidden rounded-md">
                        <Image
                        width={50}
                        height={50}
                        src={order.productImage || "/images/product/product-01.jpg"}
                        className="h-[50px] w-[50px]"
                        alt={order.productName}
                      />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                        {order.productName}
                      </p>
                      <span className="text-gray-500 text-theme-xs dark:text-gray-400">
                        {order.customerName}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  {order.category}
                </TableCell>
                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  {order.price.toLocaleString('vi-VN')}đ
                </TableCell>
                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  <Badge
                    size="sm"
                    color={getStatusColor(order.status)}
                  >
                    {order.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))
            ) : (
              <TableRow>
                <TableCell className="py-8 text-center text-gray-500 dark:text-gray-400"> </TableCell>
                <TableCell className="py-8 text-center text-gray-500 dark:text-gray-400">
                  Chưa có đơn hàng
                </TableCell>
                <TableCell className="py-8 text-center text-gray-500 dark:text-gray-400"> </TableCell>
                <TableCell className="py-8 text-center text-gray-500 dark:text-gray-400"> </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
