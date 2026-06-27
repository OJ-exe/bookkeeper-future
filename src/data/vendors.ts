export type VendorStatus = "Active" | "Inactive" | "Overdue";

export type Vendor = {
  name: string;
  initials: string;
  preferred: boolean;
  gstin: string;
  city: string;
  contactName: string;
  email: string;
  phone: string;
  spend: string;
  spendPct: string;
  payable: string;
  payableNote: string;
  status: VendorStatus;
  isNew: boolean;
};

export const vendors: Vendor[] = [
  {
    name: "Sharma Supplies", initials: "SS", preferred: true,
    gstin: "27SHARM1234F1Z5", city: "Mumbai, Maharashtra",
    contactName: "Vikram Sharma", email: "vikram@sharmasupplies.com", phone: "+91 98765 43210",
    spend: "₹3.80M", spendPct: "26% of total",
    payable: "₹65,000", payableNote: "3 bills",
    status: "Active", isNew: false,
  },
  {
    name: "Metro Logistics", initials: "ML", preferred: true,
    gstin: "29METRO9876K1Z1", city: "Bengaluru, Karnataka",
    contactName: "Anil Reddy", email: "anil@metrologistics.com", phone: "+91 91234 56789",
    spend: "₹3.10M", spendPct: "21% of total",
    payable: "₹1,40,000", payableNote: "5 bills",
    status: "Active", isNew: false,
  },
  {
    name: "Apex Components", initials: "AC", preferred: false,
    gstin: "06APEXC1234M1Z2", city: "Delhi, Delhi",
    contactName: "Sandeep Mehta", email: "sandeep@apexcomponents.com", phone: "+91 99887 76655",
    spend: "₹2.40M", spendPct: "16% of total",
    payable: "₹18,000", payableNote: "1 bill",
    status: "Active", isNew: true,
  },
  {
    name: "Greenfield Traders", initials: "GT", preferred: false,
    gstin: "33GREEN7654L1Z8", city: "Chennai, Tamil Nadu",
    contactName: "Lakshmi Nair", email: "lakshmi@greenfield.com", phone: "+91 90000 11223",
    spend: "₹1.70M", spendPct: "12% of total",
    payable: "₹0", payableNote: "Paid",
    status: "Active", isNew: false,
  },
  {
    name: "Nova Print", initials: "NP", preferred: false,
    gstin: "07NOVAP1234M1Z7", city: "Hyderabad, Telangana",
    contactName: "Pooja Rao", email: "pooja@novaprint.com", phone: "+91 88888 99000",
    spend: "₹1.10M", spendPct: "7% of total",
    payable: "₹28,000", payableNote: "2 bills",
    status: "Active", isNew: true,
  },
  {
    name: "Unity Hardware", initials: "UH", preferred: false,
    gstin: "24UNITY1234R1Z3", city: "Pune, Maharashtra",
    contactName: "Rohan Desai", email: "rohan@unityhardware.com", phone: "+91 77770 12345",
    spend: "₹920K", spendPct: "6% of total",
    payable: "₹0", payableNote: "Paid",
    status: "Inactive", isNew: false,
  },
  {
    name: "Crestline Pvt Ltd", initials: "CP", preferred: false,
    gstin: "19CREST1234T1Z9", city: "Kolkata, West Bengal",
    contactName: "Debashish Sen", email: "debashish@crestline.com", phone: "+91 90300 55667",
    spend: "₹780K", spendPct: "5% of total",
    payable: "₹92,000", payableNote: "4 bills",
    status: "Overdue", isNew: false,
  },
];

export const vendorTabs = [
  "All Vendors",
  "Preferred",
  "New",
  "Overdue Payables",
  "Inactive",
];

export const topVendors = [
  { rank: 1, name: "Sharma Supplies", preferred: true, spend: "₹3.80M", pct: "26%" },
  { rank: 2, name: "Metro Logistics", preferred: true, spend: "₹3.10M", pct: "21%" },
  { rank: 3, name: "Apex Components", preferred: false, spend: "₹2.40M", pct: "16%" },
  { rank: 4, name: "Greenfield Traders", preferred: false, spend: "₹1.70M", pct: "12%" },
  { rank: 5, name: "Nova Print", preferred: false, spend: "₹1.10M", pct: "7%" },
];
