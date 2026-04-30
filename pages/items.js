import ItemsDashboard from '../components/items/ItemsDashboard';
import DashboardLayout from '../components/layout/DashboardLayout';

export default function ItemsPage() {
  return (
    <DashboardLayout activeNav="Items">
      <ItemsDashboard />
    </DashboardLayout>
  );
}
