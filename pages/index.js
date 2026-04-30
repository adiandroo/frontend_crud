import DashboardOverview from '../components/dashboard/DashboardOverview';
import DashboardLayout from '../components/layout/DashboardLayout';

export default function Home() {
  return (
    <DashboardLayout activeNav="Dashboard">
      <DashboardOverview />
    </DashboardLayout>
  );
}
