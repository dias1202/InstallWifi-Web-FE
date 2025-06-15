import { useEffect, useState, useCallback } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import { OrderData } from "../../types/order";
import ComponentCard from "../../components/common/ComponentCard";
import { fetchData, updateData } from "../../lib/apiClient";
import Label from "../../components/form/Label";
import Button from "../../components/ui/button/Button";
import { Modal } from "../../components/ui/modal";
import Badge from "../../components/ui/badge/Badge";
import {
  Table,
  TableHeader,
  TableRow,
  TableCell,
  TableBody,
} from "../../components/ui/table";
import { useModal } from "../../hooks/useModal";
import { EditIcon } from "../../icons";
import { Dropdown } from "../../components/ui/dropdown/Dropdown";
import axios from "axios";

type Technician = {
  id: string;
  name: string;
  status: string;
};

type FormState = {
  id: string | null;
  technicianId: string;
  status: string;
};

const API_BASE_URL = process.env.PUBLIC_URL || "http://localhost:5000";
const API_ENDPOINTS = {
  orders: process.env.ENDPOINT_ORDER || "/api/orders",
  users: process.env.ENDPOINT_USER || "/api/users",
  products: process.env.ENDPOINT_PRODUCT || "/api/product",
  technicians: process.env.ENDPOINT_TECHNICIAN || "/api/technicians",
};

const statusColorMap = {
  COMPLETED: "success",
  PENDING: "warning",
  ASSIGNED: "info",
  IN_PROGRESS: "primary",
  CANCELED: "error",
} as const;

export default function TableOrders() {
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { isOpen, openModal, closeModal } = useModal();
  const [isDropdownOpen, setIsOpen] = useState(false);

  const [userMap, setUserMap] = useState<Record<string, string>>({});
  const [productMap, setProductMap] = useState<Record<string, string>>({});
  const [technicianMap, setTechnicianMap] = useState<
    Record<string, Technician>
  >({});

  const [form, setForm] = useState<FormState>({
    id: null,
    technicianId: "",
    status: "",
  });

  const toggleDropdown = useCallback(() => setIsOpen((prev) => !prev), []);
  const closeDropdown = useCallback(() => setIsOpen(false), []);

  const fetchInitialData = useCallback(async () => {
    try {
      setLoading(true);

      const [ordersData, usersData, productsData, techniciansData] =
        await Promise.all([
          fetchData<any>(`${API_BASE_URL}${API_ENDPOINTS.orders}`),
          fetchData<any>(`${API_BASE_URL}${API_ENDPOINTS.users}`),
          fetchData<any>(`${API_BASE_URL}${API_ENDPOINTS.products}`),
          fetchData<any>(`${API_BASE_URL}${API_ENDPOINTS.technicians}`),
        ]);

      setOrders(
        Array.isArray(ordersData)
          ? ordersData
          : ordersData.orders || ordersData.data || []
      );

      setUserMap(createMap(usersData, "users", "id", "name"));
      setProductMap(createMap(productsData, "products", "id", "name"));
      setTechnicianMap(createTechnicianMap(techniciansData));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal memuat data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

 const handleSave = async () => {
  try {
    if (!form.id || !form.technicianId) {
      alert("Harap pilih order dan teknisi");
      return;
    }

    // Gunakan fungsi updateData yang baru
    const response = await updateData<{
      success: boolean;
      message: string;
      data: { orderId: string; technicianId: string };
    }>(
      `${API_BASE_URL}${API_ENDPOINTS.orders}/${form.id}/assign-technician`,
      {
        method: "PUT",
        data: { technicianId: form.technicianId },
        headers: {
          // Tambahkan headers lain jika diperlukan
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }
    );

    if (response.success) {
      // Refresh data
      const [orders, technicians] = await Promise.all([
        fetchData(`${API_BASE_URL}/api/orders`),
        fetchData(`${API_BASE_URL}/api/technicians`),
      ]);

      setOrders((orders as { data?: OrderData[] })?.data || []);
      setTechnicianMap(createTechnicianMap((technicians as { data?: any[] })?.data || []));

      alert("Technician berhasil ditugaskan!");
      closeModal();
    }
  } catch (error) {
    console.error('Error dalam handleSave:', error);
    alert(
      `Gagal menugaskan teknisi: ${
        axios.isAxiosError(error)
          ? error.response?.data?.message || error.message
          : 'Terjadi kesalahan'
      }`
    );
  }
};

  const handleAssignClick = (order: OrderData) => {
    setForm({
      id: order.id,
      technicianId: order.technicianId || "",
      status: order.status,
    });
    openModal();
  };

  const getAvailableTechnicians = useCallback(() => {
    return Object.values(technicianMap).filter(
      (tech) => tech.status === "AVAILABLE"
    );
  }, [technicianMap]);

  const handleTechnicianSelect = (tech: Technician) => {
    setForm((prev) => ({ ...prev, technicianId: tech.id }));
    closeDropdown();
  };

  const renderTechnicianCell = (order: OrderData) => {
    if (!order.technicianId || order.technicianId === "") {
      return (
        <span className="italic text-gray-800 dark:text-white/90">
          Not Assign
        </span>
      );
    }
    return technicianMap[order.technicianId]?.name || order.technicianId;
  };

  const renderStatusBadge = (status: string) => (
    <Badge
      size="sm"
      color={statusColorMap[status as keyof typeof statusColorMap] || "error"}
    >
      {status}
    </Badge>
  );

  if (loading)
    return <div className="text-gray-500 dark:text-gray-400">Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <>
      <PageMeta title="Install Wifi Admin" description="Install Wifi Admin" />
      <PageBreadcrumb pageTitle="Orders" />

      <div className="space-y-6">
        <ComponentCard
          title="Orders"
          children={
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
              <div className="max-w-full overflow-x-auto">
                <Table>
                  <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                    <TableRow>
                      {[
                        "No",
                        "User",
                        "Product",
                        "Technician",
                        "Address",
                        "Order Date",
                        "Total",
                        "Status",
                        "Action",
                      ].map((header) => (
                        <TableCell
                          key={header}
                          isHeader
                          className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                        >
                          {header}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHeader>

                  <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                    {orders.map((order, idx) => (
                      <TableRow key={order.id}>
                        <TableCell className="px-5 py-4 text-gray-500 text-theme-sm dark:text-gray-400">
                          {idx + 1}
                        </TableCell>
                        <TableCell className="px-5 py-4 sm:px-6 text-start text-gray-800 dark:text-white/90">
                          {userMap[order.userId] || order.userId}
                        </TableCell>
                        <TableCell className="px-4 py-3 text-gray-800 text-start text-theme-sm dark:text-white/90">
                          {productMap[order.packageId] || order.packageId}
                        </TableCell>
                        <TableCell className="px-4 py-3 text-gray-800 text-theme-sm dark:text-white/90">
                          {renderTechnicianCell(order)}
                        </TableCell>
                        <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                          {order.address}
                        </TableCell>
                        <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                          {new Date(order.orderDate).toLocaleDateString(
                            "id-ID",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )}
                        </TableCell>
                        <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                          {order.totalPrice.toLocaleString("id-ID", {
                            style: "currency",
                            currency: "IDR",
                          })}
                        </TableCell>
                        <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                          {renderStatusBadge(order.status)}
                        </TableCell>
                        <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                          <Button
                            variant="outline"
                            startIcon={<EditIcon />}
                            type="button"
                            className="text-blue-600 border-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:border-blue-400 dark:hover:bg-blue-900/20 mr-3"
                            onClick={() => handleAssignClick(order)}
                          >
                            Assign
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          }
        />
      </div>

      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
        <div className="w-full max-w-[700px] bg-white p-4 dark:bg-gray-900 rounded-3xl overflow-y-auto max-h-[90vh]">
          <div className="px-2 pr-14">
            <h4 className="text-2xl font-semibold text-gray-800 dark:text-white/90 mb-2">
              Tugaskan Teknisi
            </h4>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              Pilih Teknisi
            </p>
          </div>

          <form className="flex flex-col">
            <div className="h-[450px] overflow-y-auto px-2">
              <div className="relative">
                <Label>Pilih Teknisi</Label>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleDropdown();
                  }}
                  className="w-full border rounded px-3 py-2 text-left bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-800 dark:text-white/90"
                >
                  {form.technicianId && technicianMap[form.technicianId]
                    ? technicianMap[form.technicianId].name
                    : "Pilih Teknisi"}
                </button>

                <Dropdown
                  isOpen={isDropdownOpen}
                  onClose={closeDropdown}
                  className="absolute z-50 mt-1 w-full bg-white dark:bg-gray-800 shadow-lg"
                >
                  <div className="border border-gray-200 dark:border-gray-700 rounded-md shadow-lg bg-white dark:bg-gray-800">
                    {getAvailableTechnicians().map((tech) => (
                      <button
                        key={tech.id}
                        type="button"
                        className="block w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-white/90"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleTechnicianSelect(tech);
                        }}
                      >
                        {tech.name}
                      </button>
                    ))}
                    {getAvailableTechnicians().length === 0 && (
                      <div className="px-4 py-2 text-gray-500 text-sm">
                        Tidak ada teknisi yang tersedia
                      </div>
                    )}
                  </div>
                </Dropdown>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 mt-6 px-2">
              <Button size="sm" variant="outline" onClick={closeModal}>
                Close
              </Button>
              <Button size="sm" onClick={handleSave}>
                Tugaskan
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
}

// Helper functions
function createMap(
  data: any,
  arrayKey: string,
  idKey: string,
  valueKey: string
): Record<string, string> {
  const items = Array.isArray(data) ? data : data[arrayKey] || [];
  return items.reduce((acc: Record<string, string>, item: any) => {
    acc[item[idKey]] = item[valueKey];
    return acc;
  }, {});
}

function createTechnicianMap(data: any): Record<string, Technician> {
  const technicians = Array.isArray(data) ? data : data.technicians || [];
  return technicians.reduce((acc: Record<string, Technician>, tech: any) => {
    acc[tech.id] = { id: tech.id, name: tech.name, status: tech.status };
    return acc;
  }, {});
}
