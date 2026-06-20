import Topbar from "@/components/dashboard/Topbar";
import MISFilterBar from "@/components/dashboard/MISFilterBar";
import MISStatsGrid from "@/components/dashboard/MISStatsGrid";
import QuickActions from "@/components/dashboard/QuickActions";

import Charts from "@/components/dashboard/Charts";
import RevenueExpenseChart from "@/components/dashboard/RevenueExpenseChart";

import AICopilot from "@/components/dashboard/AICopilot";
import BusinessHealth from "@/components/dashboard/BusinessHealth";

import OutstandingInvoices from "@/components/dashboard/OutstandingInvoices";
import PendingActions from "@/components/dashboard/PendingActions";
import TaxSummary from "@/components/dashboard/TaxSummary";

import ReceivableAgeing from "@/components/dashboard/ReceivableAgeing";
import PayableAgeing from "@/components/dashboard/PayableAgeing";

import BankingSummary from "@/components/dashboard/BankingSummary";
import MISInsights from "@/components/dashboard/MISInsights";

import RevenueChannels from "@/components/dashboard/RevenueChannels";
import ExpenseAnalysis from "@/components/dashboard/ExpenseAnalysis";

import TopCustomers from "@/components/dashboard/TopCustomers";
import TopVendors from "@/components/dashboard/TopVendors";

import SetupCard from "@/components/dashboard/SetupCard";
import TodaysFocus from "@/components/dashboard/TodaysFocus";

import Activity from "@/components/dashboard/Activity";

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <Topbar />

      {/* MIS Filters */}
      <MISFilterBar />

      {/* KPI Cards */}
      <section>
        <h2 className="text-lg font-semibold text-slate-900 mb-4">
          Financial Overview
        </h2>

        <MISStatsGrid />
      </section>

      {/* Quick Actions */}
      <section>
        <QuickActions />
      </section>

      {/* Cash Flow + AI */}
      <section>
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          <div className="lg:col-span-8">
            <Charts />
          </div>

          <div className="lg:col-span-4">
            <AICopilot />
          </div>
        </div>
      </section>

      {/* Revenue vs Expense + Health */}
      <section>
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          <div className="lg:col-span-8">
            <RevenueExpenseChart />
          </div>

          <div className="lg:col-span-4">
            <BusinessHealth />
          </div>
        </div>
      </section>

      {/* Outstanding + Tax */}
      <section>
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          <OutstandingInvoices />
          <TaxSummary />
        </div>
      </section>

      {/* Pending + Insights */}
      <section>
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          <PendingActions />
          <MISInsights />
        </div>
      </section>

      {/* Ageing */}
      <section>
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          <ReceivableAgeing />
          <PayableAgeing />
        </div>
      </section>

      {/* Banking + Revenue Channels */}
      <section>
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          <BankingSummary />
          <RevenueChannels />
        </div>
      </section>

      {/* Customers + Vendors */}
      <section>
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          <TopCustomers />
          <TopVendors />
        </div>
      </section>

      {/* Expense + Focus */}
      <section>
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          <ExpenseAnalysis />
          <TodaysFocus />
        </div>
      </section>

      {/* Setup + Activity */}
      <section>
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          <SetupCard />
          <Activity />
        </div>
      </section>
    </div>
  );
}