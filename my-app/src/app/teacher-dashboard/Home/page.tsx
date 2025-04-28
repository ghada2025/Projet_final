import { StatsGrid } from "@/components/dashboard/stats-grid";
import StudentsTable from "@/components/dashboard/students-table";

export default function Home() {
  return (
    <div className="min-h-[100vh] my-8 flex-1 md:min-h-min">
      <StudentsTable />
    </div>
  );
}
