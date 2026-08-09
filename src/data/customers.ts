export type CustomerStatus = "Active" | "Inactive" | "Overdue";

export type Customer = {
  id?: number;
  name: string;
  initials: string;
  vip: boolean;
  gstin: string;
  city: string;
  contactName: string;
  email: string;
  phone: string;
  revenue: string;
  revenuePct: string;
  outstanding: string;
  outstandingNote: string;
  status: CustomerStatus;
  isNew: boolean;
};

export const customers: Customer[] = [
  {
    name: "ABC Pvt Ltd", initials: "ABC", vip: true,
    gstin: "27ABCDE1234F1Z5", city: "Mumbai, Maharashtra",
    contactName: "Rajesh Kumar", email: "rajesh@abc.com", phone: "+91 98765 43210",
    revenue: "₹4.20M", revenuePct: "28% of total",
    outstanding: "₹45,000", outstandingNote: "2 invoices",
    status: "Active", isNew: false,
  },
  {
    name: "XYZ Industries", initials: "XYZ", vip: false,
    gstin: "29XYZAB9876K1Z1", city: "Bengaluru, Karnataka",
    contactName: "Neha Singh", email: "neha@xyz.com", phone: "+91 91234 56789",
    revenue: "₹3.50M", revenuePct: "23% of total",
    outstanding: "₹1,20,000", outstandingNote: "5 invoices",
    status: "Active", isNew: false,
  },
  {
    name: "Tech Solutions", initials: "TECH", vip: false,
    gstin: "06TECHS1234M1Z2", city: "Delhi, Delhi",
    contactName: "Ankit Verma", email: "ankit@tech.com", phone: "+91 99887 76655",
    revenue: "₹2.80M", revenuePct: "18% of total",
    outstanding: "₹15,000", outstandingNote: "1 invoice",
    status: "Active", isNew: true,
  },
  {
    name: "Global Traders", initials: "GT", vip: false,
    gstin: "33GTWRS7654L1Z8", city: "Chennai, Tamil Nadu",
    contactName: "Karthik Iyer", email: "karthik@global.com", phone: "+91 90000 11223",
    revenue: "₹1.90M", revenuePct: "12% of total",
    outstanding: "₹0", outstandingNote: "Paid",
    status: "Active", isNew: false,
  },
  {
    name: "Sunrise Enterprises", initials: "SE", vip: false,
    gstin: "07SUNRI1234M1Z7", city: "Hyderabad, Telangana",
    contactName: "Priya Patel", email: "priya@sunrise.com", phone: "+91 88888 99000",
    revenue: "₹1.20M", revenuePct: "8% of total",
    outstanding: "₹30,000", outstandingNote: "2 invoices",
    status: "Active", isNew: true,
  },
  {
    name: "BlueLine Services", initials: "BL", vip: false,
    gstin: "24BLUEL1234R1Z3", city: "Pune, Maharashtra",
    contactName: "Amit Joshi", email: "amit@blueline.com", phone: "+91 77770 12345",
    revenue: "₹980K", revenuePct: "6% of total",
    outstanding: "₹0", outstandingNote: "Paid",
    status: "Inactive", isNew: false,
  },
  {
    name: "Innovate Works", initials: "IW", vip: false,
    gstin: "19INNOV1234T1Z9", city: "Kolkata, West Bengal",
    contactName: "Sourav Roy", email: "sourav@innovate.com", phone: "+91 90300 55667",
    revenue: "₹750K", revenuePct: "5% of total",
    outstanding: "₹85,000", outstandingNote: "3 invoices",
    status: "Overdue", isNew: false,
  },
];

export const customerTabs = [
  "All Customers",
  "VIP Customers",
  "New Customers",
  "Overdue Payments",
  "Inactive Customers",
];

export const topCustomers = [
  { rank: 1, name: "ABC Pvt Ltd", vip: true, revenue: "₹4.20M", pct: "28%" },
  { rank: 2, name: "XYZ Industries", vip: false, revenue: "₹3.50M", pct: "23%" },
  { rank: 3, name: "Tech Solutions", vip: false, revenue: "₹2.80M", pct: "18%" },
  { rank: 4, name: "Global Traders", vip: false, revenue: "₹1.90M", pct: "12%" },
  { rank: 5, name: "Sunrise Enterprises", vip: false, revenue: "₹1.20M", pct: "8%" },
];

export const revenueContribution = [
  { name: "Top 10 Customers", value: 65, amount: "₹10.0M" },
  { name: "Other Customers", value: 35, amount: "₹5.4M" },
];
