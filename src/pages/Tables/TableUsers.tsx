import { useEffect, useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import TableUser from "../../components/tables/TableUser";
import { fetchData } from "../../lib/apiClient";
import ComponentCard from "../../components/common/ComponentCard";

// Pastikan tipe data sesuai dengan struktur data dari API
interface UserData {
  id: number;
  name: string;
  email: string;
  photoUrl: string;
  phoneNumber: string;
  address: string;
}

export default function TableUsers() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Gunakan variabel lingkungan yang benar untuk base URL
  const baseUrl = process.env.PUBLIC_URL || "http://localhost:5000";
  const endpointUser = process.env.ENDPOINT_USER || "/api/users";


  useEffect(() => {
    fetchData<any>(`${baseUrl}${endpointUser}/`)
      .then((data) => {
        // Pastikan data yang dikirim ke TableUser adalah array
        setUsers(Array.isArray(data) ? data : data.users || data.data || []);
      })
      .catch((err) => setError(err.message || "Gagal memuat data"))
      .finally(() => setLoading(false));
  }, [baseUrl, endpointUser]);

  return (
    <>
      <PageMeta
        title="Install Wifi Admin"
        description="Install Wifi Admin"
      />
      <PageBreadcrumb pageTitle="Users" />
      <div className="space-y-6">
        {loading ? (
          <div className="text-gray-500 dark:text-gray-400">Loading...</div>
        ) : error ? (
          <div className="text-red-500">{error}</div>
        ) : (
          <ComponentCard
            title={"Users"}
            children={<TableUser data={users} />}
          />
        )}
      </div>
    </>
  );
}
