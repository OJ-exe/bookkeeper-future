import {
  TrendingUp,
  Receipt,
  FileCheck,
  DollarSign,
} from "lucide-react";

async function getDashboardSummary() {
  return {
    totalRevenue: 54320.0,
    openInvoicesCount: 14,
    unpaidBillsTotal: 12450.0,
    cashOnHand: 41870.0,
    recentInvoices: [
      { id: "1", number: "INV-1021", customer: "Apex Global", amount: 4200, status: "PAID" },
      { id: "2", number: "INV-1022", customer: "Nexus Dynamics", amount: 1850, status: "PENDING" },
      { id: "3", number: "INV-1023", customer: "Strata Labs", amount: 3100, status: "DRAFT" },
    ],
  };
}

export default async function DashboardPage() {
  const data = await getDashboardSummary();

  const stats = [
    { name: "Total Cash on Hand", value: `$${data.cashOnHand.toLocaleString()}`, icon: DollarSign, change: "+8.2%" },
    { name: "Total Revenue (YTD)", value: `$${data.totalRevenue.toLocaleString()}`, icon: TrendingUp, change: "+14.5%" },
    { name: "Open Invoices", value: data.openInvoicesCount, icon: FileCheck, change: "14 Pending" },
    { name: "Unpaid Bills", value: `$${data.unpaidBillsTotal.toLocaleString()}`, icon: Receipt, change: "Due in 30d" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Financial Overview</h1>
        <p className="text-sm text-slate-400">Real-time breakdown of cash flow, receivables, and payables.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="p-5 rounded-xl border border-slate-800 bg-slate-900/50">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{stat.name}</span>
                <Icon className="h-4 w-4 text-slate-400" />
              </div>
              <div className="mt-3">
                <span className="text-2xl font-bold text-white">{stat.value}</span>
                <span className="ml-2 text-xs text-emerald-400 font-medium">{stat.change}</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Recent Invoices</h2>
        <div className="divide-y divide-slate-800">
          {data.recentInvoices.map((inv) => (
            <div key={inv.id} className="py-3 flex items-center justify-between text-sm">
              <div>
                <p className="font-medium text-slate-200">{inv.customer}</p>
                <p className="text-xs text-slate-400">{inv.number}</p>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-semibold text-slate-100">${inv.amount.toLocaleString()}</span>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                  inv.status === "PAID" ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-400"
                }`}>
                  {inv.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}