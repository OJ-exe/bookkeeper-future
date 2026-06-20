import Greeting from "@/components/dashboard/Greeting";
import BusinessHealthCard from "@/components/dashboard/BusinessHealthCard";
import AIRailPanel from "@/components/ui/AIRailPanel";
import KpiRow from "@/components/dashboard/KpiRow";
import QuickActionsRow from "@/components/dashboard/QuickActionsRow";
import CashFlowChart from "@/components/dashboard/CashFlowChart";
import RevenueExpensesChart from "@/components/dashboard/RevenueExpensesChart";
import OutstandingDonut from "@/components/dashboard/OutstandingDonut";
import SetupWorkbench from "@/components/dashboard/SetupWorkbench";
import TodaysFocusCard from "@/components/dashboard/TodaysFocusCard";
import RecentActivity from "@/components/dashboard/RecentActivity";
import InsightsPanel from "@/components/dashboard/InsightsPanel";
import BottomStats from "@/components/dashboard/BottomStats";

const aiPrompts = [
  "Generate MIS Report",
  "Forecast Cash Flow",
  "Explain GST Reconciliation",
  "Find Overdue Invoices",
  "Create Invoice",
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Top band: main column (greeting + KPIs + quick actions) beside the tall Health/AI rail */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-8 space-y-6">
          <Greeting />
          <KpiRow />
          <QuickActionsRow />
        </div>

        <div className="xl:col-span-4 grid grid-cols-1 sm:grid-cols-2 gap-6 items-stretch [&>*]:h-full">
          <BusinessHealthCard />
          <AIRailPanel
            prompts={aiPrompts}
            greeting="Hi Ojaswini! How can I help you today?"
          />
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch [&>*]:h-full">
        <CashFlowChart />
        <RevenueExpensesChart />
        <OutstandingDonut />
      </div>

      {/* Lower row */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 items-stretch [&>*]:h-full">
        <SetupWorkbench />
        <TodaysFocusCard />
        <RecentActivity />
        <InsightsPanel />
      </div>

      <BottomStats />
    </div>
  );
}
