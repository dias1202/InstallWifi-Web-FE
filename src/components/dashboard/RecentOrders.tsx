import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";
import { fetchData } from "../../lib/apiClient";
import { OrderData } from "../../types/order";
import { UserData } from "../../types/user";
import { ProductData } from "../../types/product";

export default function RecentOrders() {
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [userMap, setUserMap] = useState<{ [key: string]: UserData }>({});
  const [productMap, setProductMap] = useState<{ [key: string]: ProductData }>(
    {}
  );

  const baseUrl = process.env.PUBLIC_URL || "http://localhost:5000";
  const endpointUser = process.env.ENDPOINT_USER || "/api/users";
  const endpointProduct = process.env.ENDPOINT_PRODUCT || "/api/product";
  const endpointOrder = process.env.ENDPOINT_ORDER || "/api/orders";

  useEffect(() => {
    fetchData<any>(`${baseUrl}${endpointOrder}/`).then((data) => {
      setOrders(Array.isArray(data) ? data : data.orders || data.data || []);
    });
    fetchData<any>(`${baseUrl}${endpointUser}`).then((data) => {
      const users = Array.isArray(data) ? data : data.users || [];
      const map: { [key: string]: UserData } = {};
      users.forEach((u: UserData) => {
        map[u.id] = u;
      });
      setUserMap(map);
    });
    fetchData<any>(`${baseUrl}${endpointProduct}`).then((data) => {
      const products = Array.isArray(data) ? data : data.products || [];
      const map: { [key: string]: ProductData } = {};
      products.forEach((p: ProductData) => {
        map[p.id] = p;
      });
      setProductMap(map);
    });
  }, [baseUrl, endpointUser, endpointProduct, endpointOrder]);

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
      <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Recent Orders
          </h3>
        </div>
      </div>
      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader className="border-gray-100 dark:border-gray-800 border-y">
            <TableRow>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                User
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Product
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Price
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Status
              </TableCell>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
            {orders.slice(0, 5).map((order) => (
              <TableRow key={order.id}>
                <TableCell className="py-3 text-gray-800 text-theme-sm dark:text-white/90">
                  {userMap[order.userId]?.name || order.userId}
                </TableCell>
                <TableCell className="py-3 text-gray-800 text-theme-sm dark:text-white/90">
                  {productMap[order.packageId]?.name || order.packageId}
                </TableCell>
                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  {order.totalPrice?.toLocaleString("id-ID", {
                    style: "currency",
                    currency: "IDR",
                  }) || "-"}
                </TableCell>
                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  <Badge
                    size="sm"
                    color={
                      order.status === "COMPLETED"
                        ? "success"
                        : order.status === "PENDING"
                        ? "warning"
                        : order.status === "CANCELED"
                        ? "error"
                        : "primary"
                    }
                  >
                    {order.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
