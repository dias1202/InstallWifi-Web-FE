export interface OrderData {
  id: string;
  userId: string;
  packageId: string;
  technicianId: string;
  assignedAt: number;
  address: string;
  orderDate: string;
  totalPrice: number;
  status: string;
  confirmedByUser: boolean;
  confirmedByAdmin: boolean;
  installationPhotoUrl: string;
}
