import { useState, useEffect } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import { fetchData, postData } from "../../lib/apiClient";
import { TechnicianData } from "../../types/technician";
import Button from "../../components/ui/button/Button";
import Badge from "../../components/ui/badge/Badge";
import {
  Table,
  TableHeader,
  TableRow,
  TableCell,
  TableBody,
} from "../../components/ui/table";
import { useModal } from "../../hooks/useModal";
import Input from "../../components/form/input/InputField";
import Label from "../../components/form/Label";
import { Modal } from "../../components/ui/modal";
import { EnvelopeIcon } from "../../icons";

export default function TableTechnicians() {
  const [technicians, setTechnicians] = useState<TechnicianData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { isOpen, openModal, closeModal } = useModal();

  const [form, setForm] = useState({
    id: null as string | null,
    name: "",
    location: "",
    email: "",
    password: "",
  });

  const baseUrl = process.env.PUBLIC_URL || "http://localhost:5000";
  const endpointTechnician =
    process.env.ENDPOINT_TECHNICIAN || "/api/technicians";

  useEffect(() => {
    fetchData<any>(`${baseUrl}${endpointTechnician}/`)
      .then((data) => {
        setTechnicians(
          Array.isArray(data) ? data : data.technicians || data.data || []
        );
      })
      .catch((err) => setError(err.message || "Gagal memuat data"))
      .finally(() => setLoading(false));
  }, [baseUrl, endpointTechnician]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("location", form.location);
      formData.append("email", (`${form.email}.tech@gmail.com`));
      formData.append("password", form.password);
      formData.append("status", "AVAILABLE");

      formData.forEach((value, key) => {
        console.log(`${key}:`, value);
      });
      await postData(`${baseUrl}${endpointTechnician}/`, formData, {
        headers: {
          "Content-Type": "application/json"
        }
      });

      setForm({ id: null, name: "", location: "", email: "", password: "" });
      closeModal();

      const newData = await fetchData<any>(`${baseUrl}${endpointTechnician}/`);
      setTechnicians(
        Array.isArray(newData)
          ? newData
          : newData.technicians || newData.data || []
      );
    } catch (error) {
      console.error("Gagal menambahkan teknisi:", error);
      if (error instanceof Error) {
        alert(`Gagal menambahkan teknisi: ${error.message}`);
      }
    }
  };

  return (
    <>
      <PageMeta
        title="Install Wifi Admin"
        description="Install Wifi Admin"
      />
      <PageBreadcrumb pageTitle="Technicians" />
      <div className="space-y-6">
        {loading ? (
          <div className="text-gray-500 dark:text-gray-400">Loading...</div>
        ) : error ? (
          <div className="text-red-500">{error}</div>
        ) : (
          <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
            <div className="px-6 py-5 flex items-center justify-between">
              <div>
                <h3 className="text-base font-medium text-gray-800 dark:text-white/90">
                  Teknisi
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400"></p>
              </div>
              <Button
                onClick={openModal}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Tambah Teknisi
              </Button>
            </div>

            <div className="p-4 border-t border-gray-100 dark:border-gray-800 sm:p-6">
              <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
                <div className="max-w-full overflow-x-auto">
                  <div className="min-w-[1102px]">
                    <Table>
                      <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                        <TableRow>
                          <TableCell
                            isHeader
                            className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                          >
                            No
                          </TableCell>
                          <TableCell
                            isHeader
                            className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                          >
                            Nama
                          </TableCell>
                          <TableCell
                            isHeader
                            className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                          >
                            Nomor Hp
                          </TableCell>
                          <TableCell
                            isHeader
                            className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                          >
                            Status
                          </TableCell>
                          <TableCell
                            isHeader
                            className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                          >
                            Pekerjaan yang Ditugaskan
                          </TableCell>
                          <TableCell
                            isHeader
                            className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                          >
                            Lokasi
                          </TableCell>
                          <TableCell
                            isHeader
                            className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                          >
                            Total Pekerjaan Selesai
                          </TableCell>
                          <TableCell
                            isHeader
                            className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                          >
                            Created At
                          </TableCell>
                        </TableRow>
                      </TableHeader>
                      <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                        {technicians.map((tech, idx) => (
                          <TableRow key={tech.id}>
                            <TableCell className="px-5 py-4 text-gray-500 text-theme-sm dark:text-gray-400">
                              {idx + 1}
                            </TableCell>
                            <TableCell className="px-5 py-4 text-gray-800 text-theme-sm dark:text-white/90">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 overflow-hidden rounded-full">
                                  <img
                                    src={tech.photoUrl ? tech.photoUrl : "/images/user/user-01.jpg"}
                                    alt={tech.name}
                                  />
                                </div>
                                <div>
                                  <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                                    {tech.name}
                                  </span>
                                  <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                                    {tech.email}
                                  </span>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="px-5 py-4 text-gray-500 text-theme-sm dark:text-gray-400">
                              {tech.phone ? tech.phone : "not added yet"}
                            </TableCell>
                            <TableCell className="px-5 py-4 text-gray-500 text-theme-sm dark:text-gray-400">
                              <Badge
                                size="sm"
                                color={
                                  tech.status === "AVAILABLE"
                                    ? "success"
                                    : tech.status === "ON_DUTY"
                                    ? "primary"
                                    : tech.status === "OFF"
                                    ? "error"
                                    : "warning"
                                }
                              >
                                {tech.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="px-5 py-4 text-gray-500 text-theme-sm dark:text-gray-400">
                              {tech.assignedJobId || "-"}
                            </TableCell>
                            <TableCell className="px-5 py-4 text-gray-500 text-theme-sm dark:text-gray-400">
                              {tech.location}
                            </TableCell>
                            <TableCell className="px-5 py-4 text-gray-500 text-theme-sm dark:text-gray-400">
                              {tech.totalJobsCompleted ? tech.totalJobsCompleted : "0"}
                            </TableCell>
                            <TableCell className="px-5 py-4 text-gray-500 text-theme-sm dark:text-gray-400">
                              {tech.createdAt
                                ? new Date(tech.createdAt).toLocaleDateString(
                                    "id-ID"
                                  )
                                : "-"}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
        <div className="w-full max-w-[700px] bg-white p-4 dark:bg-gray-900 rounded-3xl overflow-y-auto max-h-[90vh]">
          <div className="px-2 pr-14">
            <h4 className="text-2xl font-semibold text-gray-800 dark:text-white/90 mb-2">
              Tambah Teknisi
            </h4>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              Tambah Teknisi Baru.
            </p>
          </div>
          <form className="flex flex-col">
            <div className="h-[450px] overflow-y-auto px-2">
              <div className="grid grid-cols-1 gap-5 lg:grid-cols-1">
                <div>
                  <Label>Nama Teknisi</Label>
                  <Input
                    placeholder="Name"
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <Label>Lokasi</Label>
                  <Input
                  placeholder="lokasi"
                  type="text"
                  name="location"
                  onChange={handleChange}
                  value={form.location}
                  />
                </div>
                <div>
                  <Label>Email</Label>
                  <div className="relative flex">
                    <Input
                      placeholder="username"
                      type="text"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      className="pl-[62px] rounded-r-none w-96"
                    />
                    <span className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-200 bg-gray-50 text-gray-500 dark:border-gray-800 dark:bg-gray-800 dark:text-gray-400">
                      .tech@gmail.com
                    </span>
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 border-r border-gray-200 px-3.5 py-3 text-gray-500 dark:border-gray-800 dark:text-gray-400">
                      <EnvelopeIcon />
                    </span>
                  </div>
                </div>
                <div>
                  <div className="relative">
                    <Label>Password</Label>
                    <Input
                      type={"text"}
                      placeholder="Enter your password"
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 mt-6 px-2">
              <Button size="sm" variant="outline" onClick={closeModal}>
                Close
              </Button>
              <Button size="sm" onClick={handleSave}>
                Tambah teknisi
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
}
