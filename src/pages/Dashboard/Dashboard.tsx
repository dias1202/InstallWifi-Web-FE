import EcommerceMetrics from "../../components/dashboard/DashboardMetrics";
import RecentOrders from "../../components/dashboard/RecentOrders";
import PageMeta from "../../components/common/PageMeta";

export default function Dashboard() {
  return (
    <>
      <PageMeta
        title="Install Wifi Dashboard"
        description="Install Wifi Admin"
      />
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-12 space-y-6">
          <EcommerceMetrics />
        </div>

        <div className="col-span-12 xl:col-span-12">
          <RecentOrders />
        </div>
      </div>
    </>
  );
}
