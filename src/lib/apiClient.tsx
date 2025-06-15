import axios, { AxiosRequestConfig } from "axios";

// Fungsi untuk fetch data dari API menggunakan axios
export async function fetchData<T>(url: string): Promise<T> {
  const response = await axios.get<T>(url);
  return response.data;
}

// Fungsi untuk POST data ke API menggunakan axios
export async function postData<T>(
  url: string,
  data: any,
  config?: AxiosRequestConfig
): Promise<T> {
  const response = await axios.post<T>(url, data, config);
  return response.data;
}
// Fungsi untuk UPDATE data ke API Menggunakan axios
export async function updateData<T = any>(
  url: string,
  config: {
    method?: string;
    data?: any;
    headers?: Record<string, string>;
    [key: string]: any;
  }
): Promise<T> {
  try {
    // Default configuration
    const defaultConfig: AxiosRequestConfig = {
      headers: {
        "Content-Type": "application/json",
        ...config.headers, // Gabungkan dengan headers custom
      },
    };

    const response = await axios({
      url,
      method: config.method || "PUT", // Default ke PUT jika tidak ditentukan
      data: config.data,
      ...defaultConfig,
      ...config, // Config lainnya akan menimpa default
    });

    console.log("Request berhasil:", {
      url,
      status: response.status,
      data: response.data,
    });

    return response.data;
  } catch (error) {
    console.error("Error dalam updateData:", {
      url,
      error: axios.isAxiosError(error)
        ? {
            message: error.message,
            status: error.response?.status,
            data: error.response?.data,
            config: error.config,
          }
        : error,
    });

    throw error;
  }
}

// Fungsi untuk DELETE data ke API Menggunakan axios
export async function deleteData<T>(
  url: string,
  config?: AxiosRequestConfig
): Promise<T> {
  const response = await axios.delete<T>(url, config);
  return response.data;
}
