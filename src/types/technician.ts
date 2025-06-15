export interface TechnicianData {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: string;
  assignedJobId: string | null;
  location: string;
  photoUrl: string | null;
  totalJobsCompleted: number;
  createdAt: string | null;
}
