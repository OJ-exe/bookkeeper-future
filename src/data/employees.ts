export type EmployeeStatus = "Active" | "On Leave" | "Inactive";

export type Department =
  | "Sales"
  | "Finance"
  | "Operations"
  | "HR"
  | "Engineering";

export type Employee = {
  code: string;
  name: string;
  initials: string;
  department: Department;
  designation: string;
  email: string;
  phone: string;
  ctc: string;
  status: EmployeeStatus;
  joinedNew: boolean;
};

export const departments: Department[] = [
  "Sales",
  "Finance",
  "Operations",
  "HR",
  "Engineering",
];

export const employeeTabs = [
  "All Employees",
  "Active",
  "On Leave",
  "New Joiners",
  "Inactive",
];

export const employees: Employee[] = [
  {
    code: "EMP-001",
    name: "Rajesh Kumar",
    initials: "RK",
    department: "Sales",
    designation: "Sales Manager",
    email: "rajesh.kumar@company.com",
    phone: "+91 98765 43210",
    ctc: "₹14.4L",
    status: "Active",
    joinedNew: false,
  },
  {
    code: "EMP-007",
    name: "Neha Singh",
    initials: "NS",
    department: "Finance",
    designation: "Senior Accountant",
    email: "neha.singh@company.com",
    phone: "+91 91234 56789",
    ctc: "₹11.2L",
    status: "Active",
    joinedNew: false,
  },
  {
    code: "EMP-011",
    name: "Ankit Verma",
    initials: "AV",
    department: "Engineering",
    designation: "Software Engineer",
    email: "ankit.verma@company.com",
    phone: "+91 99887 76655",
    ctc: "₹18.6L",
    status: "Active",
    joinedNew: false,
  },
  {
    code: "EMP-014",
    name: "Priya Sharma",
    initials: "PS",
    department: "HR",
    designation: "HR Executive",
    email: "priya.sharma@company.com",
    phone: "+91 90011 22334",
    ctc: "₹7.8L",
    status: "On Leave",
    joinedNew: false,
  },
  {
    code: "EMP-019",
    name: "Mohan Das",
    initials: "MD",
    department: "Operations",
    designation: "Operations Lead",
    email: "mohan.das@company.com",
    phone: "+91 98201 44556",
    ctc: "₹12.0L",
    status: "Active",
    joinedNew: false,
  },
  {
    code: "EMP-023",
    name: "Sana Khan",
    initials: "SK",
    department: "Sales",
    designation: "Sales Executive",
    email: "sana.khan@company.com",
    phone: "+91 97712 88990",
    ctc: "₹6.6L",
    status: "Active",
    joinedNew: true,
  },
  {
    code: "EMP-026",
    name: "Vikram Rao",
    initials: "VR",
    department: "Engineering",
    designation: "QA Engineer",
    email: "vikram.rao@company.com",
    phone: "+91 96655 33221",
    ctc: "₹9.6L",
    status: "Active",
    joinedNew: true,
  },
  {
    code: "EMP-030",
    name: "Deepa Nair",
    initials: "DN",
    department: "Finance",
    designation: "Accounts Assistant",
    email: "deepa.nair@company.com",
    phone: "+91 95544 66778",
    ctc: "₹5.4L",
    status: "Inactive",
    joinedNew: false,
  },
];
