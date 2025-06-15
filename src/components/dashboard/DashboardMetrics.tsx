import React, { useEffect } from "react";
import { fetchData } from "../../lib/apiClient";
import {
  BoxIconLine,
  GroupIcon,
  InvoiceIcon,
  TechnicianIcon,
} from "../../icons";

export default function EcommerceMetrics() {
  const [totalCustomers, setTotalCustomers] = React.useState(0);
  const [totalProducts, setTotalProducts] = React.useState(0);
  const [totalOrders, setTotalOrders] = React.useState(0);
  const [totalTechnicians, setTotalTechnicians] = React.useState(0);

  const baseUrl = process.env.REACT_APP_API_URL || "http://localhost:5000";
  const endpointUser = process.env.ENDPOINT_USER || "/api/users";
  const endpointProduct = process.env.ENDPOINT_PRODUCT || "/api/product";
  const endpointTechnician =
    process.env.ENDPOINT_TECHNICIAN || "/api/technicians";
  const endpointOrder = process.env.ENDPOINT_ORDER || "/api/orders";

  useEffect(() => {
    fetchData<any>(`${baseUrl}${endpointUser}/`)
      .then((data) => {
        setTotalCustomers(
          data.total.users ??
            (Array.isArray(data.users) ? data.users.length : 0)
        );
      })
      .catch((error) => {
        console.error("Error fetching customers:", error);
      });
    fetchData<any>(`${baseUrl}${endpointProduct}/`)
      .then((data) => {
        setTotalProducts(
          data.total.products ??
            (Array.isArray(data.products) ? data.products.length : 0)
        );
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });
    fetchData<any>(`${baseUrl}${endpointTechnician}/`)
      .then((data) => {
        setTotalTechnicians(
          data.total.technicians ??
            (Array.isArray(data.technicians) ? data.technicians.length : 0)
        );
      })
      .catch((error) => {
        console.error("Error fetching technicians:", error);
      });
    fetchData<any>(`${baseUrl}${endpointOrder}/`)
      .then((data) => {
        setTotalOrders(
          data.total.orders ??
            (Array.isArray(data.orders) ? data.orders.length : 0)
        );
      })
      .catch((error) => {
        console.error("Error fetching orders:", error);
      });
  });
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-4 md:gap-6">
      {/* <!-- Metric Item Start --> */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <GroupIcon className="text-gray-800 size-6 dark:text-white/90" />
        </div>

        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Customers
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {totalCustomers}
            </h4>
          </div>
        </div>
      </div>
      {/* <!-- Metric Item End --> */}

      {/* <!-- Metric Item Start --> */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <BoxIconLine className="text-gray-800 dark:text-white/90" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Products
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {totalProducts}
            </h4>
          </div>
        </div>
      </div>
      {/* <!-- Metric Item End --> */}

      {/* <!-- Metric Item Start --> */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <InvoiceIcon className="text-gray-800 dark:text-white/90" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Orders
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {totalOrders}
            </h4>
          </div>
        </div>
      </div>
      {/* <!-- Metric Item End --> */}

      {/* <!-- Metric Item Start --> */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <TechnicianIcon className="text-gray-800 dark:text-white/90" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Technicians
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {totalTechnicians}
            </h4>
          </div>
        </div>
      </div>
      {/* <!-- Metric Item End --> */}
    </div>
  );
}
