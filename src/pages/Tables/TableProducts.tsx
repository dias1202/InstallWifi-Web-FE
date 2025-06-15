import { useEffect, useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import {
  deleteData,
  fetchData,
  postData,
  updateData,
} from "../../lib/apiClient";
import { ProductData } from "../../types/product";
import Button from "../../components/ui/button/Button";
import { Modal } from "../../components/ui/modal";
import { useModal } from "../../hooks/useModal";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import FileInput from "../../components/form/input/FileInput";
import { EditIcon, TrashBinIcon } from "../../icons";

export default function TableProducts() {
  const [products, setProducts] = useState<ProductData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { isOpen, openModal, closeModal } = useModal();
  const [isEditing, setIsEditing] = useState(false);

  const [form, setForm] = useState({
    id: null as number | null,
    name: "",
    price: "",
    speed: "",
    image: null as File | null,
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const baseUrl = process.env.API_URL || "http://localhost:5000";
  const endpointProduct = process.env.ENDPOINT_PRODUCT || "/api/product";

  useEffect(() => {
    fetchData<any>(`${baseUrl}${endpointProduct}/`)
      .then((data) => {
        setProducts(
          Array.isArray(data) ? data : data.products || data.data || []
        );
      })
      .catch((err) => setError(err.message || "Gagal memuat data"))
      .finally(() => setLoading(false));
  }, [baseUrl, endpointProduct]);

  useEffect(() => {
    if (!isOpen) {
      setForm({ id: null, name: "", price: "", speed: "", image: null });
      setImagePreview(null);
      setIsEditing(false);
    }
  }, [isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setForm((prev) => ({ ...prev, image: file }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("price", form.price);
      formData.append("speed", form.speed);
      if (form.image) {
        formData.append("image", form.image);
      }

      if (isEditing && form.id !== null) {
        formData.forEach((value, key) => {
          console.log(`${key}:`, value);
        });
        await updateData(`${baseUrl}${endpointProduct}/${form.id}`, {
          method: "PUT",
          data: formData,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      } else {
        // Mode tambah: lakukan POST
        formData.forEach((value, key) => {
          console.log(`${key}:`, value);
        });
        await postData(`${baseUrl}${endpointProduct}/`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }

      // Reset form dan ambil ulang data
      setForm({ id: null, name: "", price: "", speed: "", image: null });
      setImagePreview(null);
      closeModal();
      setIsEditing(false);

      const newData = await fetchData<any>(`${baseUrl}${endpointProduct}/`);
      setProducts(
        Array.isArray(newData)
          ? newData
          : newData.products || newData.data || []
      );
    } catch (error) {
      console.error("Gagal menyimpan produk:", error);
      if (error instanceof Error) {
        alert(`Gagal menyimpan produk: ${error.message}`);
      }
    }
  };

  function handleEdit(product: ProductData): void {
    setForm({
      id: product.id,
      name: product.name,
      price: product.price.toString(),
      speed: product.speed.toString(),
      image: null,
    });
    setImagePreview(product.imageUrl || null);
    setIsEditing(true);
    openModal();
  }

  const handleDelete = async (id: number) => {
    if (!window.confirm("Yakin ingin menghapus produk ini?")) return;
    try {
      await deleteData(`${baseUrl}${endpointProduct}/${id}`);
      const newData = await fetchData<any>(`${baseUrl}${endpointProduct}/`);
      setProducts(
        Array.isArray(newData)
          ? newData
          : newData.products || newData.data || []
      );
    } catch (error) {
      alert("Gagal menghapus produk");
    }
  };

  return (
    <>
      <PageMeta title="Install Wifi Admin" description="Install Wifi Admin" />
      <PageBreadcrumb pageTitle="Products" />

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
                  Product
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Tambahkan produk
                </p>
              </div>
              <Button
                onClick={openModal}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Tambah Produk
              </Button>
            </div>

            <div className="p-4 border-t border-gray-100 dark:border-gray-800 sm:p-6">
              <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
                <div className="max-w-full overflow-x-auto">
                  <div className="min-w-[1102px]">
                    <Table>
                      <TableHeader className="border-b border-gray-100 dark:border-white/[0.05] bg-gray-50 dark:bg-gray-800">
                        <TableRow>
                          <TableCell
                            isHeader
                            className="px-5 py-3 text-start text-gray-700 dark:text-white/80 font-semibold"
                          >
                            No
                          </TableCell>
                          <TableCell
                            isHeader
                            className="px-5 py-3 text-start text-gray-700 dark:text-white/80 font-semibold"
                          >
                            Product
                          </TableCell>
                          <TableCell
                            isHeader
                            className="px-5 py-3 text-start text-gray-700 dark:text-white/80 font-semibold"
                          >
                            Price
                          </TableCell>
                          <TableCell
                            isHeader
                            className="px-5 py-3 text-start text-gray-700 dark:text-white/80 font-semibold"
                          >
                            Speed
                          </TableCell>
                          <TableCell
                            isHeader
                            className="px-5 py-3 text-center text-gray-700 dark:text-white/80 font-semibold"
                          >
                            Action
                          </TableCell>
                        </TableRow>
                      </TableHeader>
                      <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                        {products.map((product, idx) => (
                          <TableRow
                            key={product.id}
                            className="bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                          >
                            <TableCell className="px-5 py-4 text-gray-500 dark:text-gray-300">
                              {idx + 1}
                            </TableCell>
                            <TableCell className="px-5 py-4 text-gray-800 dark:text-white/90">
                              <div className="flex items-center gap-3">
                                <img
                                  src={product.imageUrl}
                                  alt={product.name}
                                  className="w-10 h-10 object-cover rounded border border-gray-200 dark:border-gray-700"
                                />
                                {product.name}
                              </div>
                            </TableCell>
                            <TableCell className="px-5 py-4 text-gray-500 dark:text-gray-300">
                              {product.price.toLocaleString("id-ID", {
                                style: "currency",
                                currency: "IDR",
                              })}
                            </TableCell>
                            <TableCell className="px-5 py-4 text-gray-500 dark:text-gray-300">
                              {product.speed} Mbps
                            </TableCell>
                            <TableCell className="text-center">
                              <Button
                                children={"Edit"}
                                variant="outline"
                                startIcon={<EditIcon />}
                                type="button"
                                className="text-blue-600 border-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:border-blue-400 dark:hover:bg-blue-900/20 mr-3"
                                onClick={() => handleEdit(product)}
                              />
                              <Button
                                children={"Delete"}
                                variant="outline"
                                startIcon={<TrashBinIcon />}
                                type="button"
                                className="text-red-600 border-red-600 hover:bg-red-50 dark:text-red-400 dark:border-red-400 dark:hover:bg-red-900/20"
                                onClick={() => handleDelete(product.id)}
                              />
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
              Tambah Produk
            </h4>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              Tambahkan produkmu.
            </p>
          </div>
          <form className="flex flex-col">
            <div className="h-[450px] overflow-y-auto px-2">
              <div className="grid grid-cols-1 gap-5 lg:grid-cols-1">
                <div>
                  <Label>Nama Produk</Label>
                  <Input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <Label>Harga</Label>
                  <Input
                    type="number"
                    name="price"
                    value={form.price}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <Label>Kecepatan</Label>
                  <Input
                    type="number"
                    name="speed"
                    value={form.speed}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <Label>Masukan Gambar</Label>
                  <FileInput onChange={handleImageChange} />
                  {imagePreview && (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-32 h-32 object-cover mt-4 rounded-lg border"
                    />
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 mt-6 px-2">
              <Button size="sm" variant="outline" onClick={closeModal}>
                Close
              </Button>
              <Button size="sm" onClick={handleSave}>
                {isEditing ? "Edit Produk" : "Tambah Produk"}
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
}
