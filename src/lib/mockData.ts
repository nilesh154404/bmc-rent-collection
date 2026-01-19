// Mock data for the BMC Rent & Lease Management Portal

export type OccupantType = 'tenant' | 'lessee';

export interface Tenant {
  id: string;
  name: string;
  email: string;
  password: string;
  phone: string;
  propertyId: string;
  propertyNo: string;
  propertyLocation: string;
  rentAmount: number;
  outstandingAmount: number;
  contractStartDate: string;
  contractEndDate: string;
  eNachStatus: 'not_registered' | 'pending' | 'active' | 'rejected';
  contractStatus: 'active' | 'expiring_soon' | 'expired';
  occupantType: OccupantType;
  aadharNo?: string;
  panNo?: string;
  address?: string;
}

export interface Property {
  id: string;
  propertyNo: string;
  location: string;
  area: number;
  category: string;
  rentRate: number;
  escalationRate: number;
  securityDeposit: number;
  status: 'occupied' | 'vacant';
  propertyType: 'rent' | 'lease';
  zone: string;
  ward: string;
  gisCoordinates?: string;
}

export interface Payment {
  id: string;
  tenantId: string;
  tenantName: string;
  propertyNo: string;
  amount: number;
  paymentDate: string;
  paymentMode: 'enach' | 'online' | 'cash' | 'cheque';
  status: 'success' | 'failed' | 'pending';
  transactionId: string;
  receiptNo: string;
  billingPeriod?: string;
}

export interface ENachMandate {
  id: string;
  mandateId: string;
  tenantId: string;
  tenantName: string;
  propertyNo: string;
  amount: number;
  frequency: 'monthly' | 'quarterly' | 'yearly';
  bankName: string;
  registrationDate: string;
  status: 'pending' | 'active' | 'rejected' | 'cancelled';
  umrn?: string;
  accountNo?: string;
  ifscCode?: string;
}

export interface Notice {
  id: string;
  tenantId: string;
  tenantName: string;
  propertyNo: string;
  type: 'reminder' | 'overdue' | 'final_notice' | 'lock_seal' | 'eviction';
  issueDate: string;
  serveDate?: string;
  acknowledged: boolean;
  content?: string;
}

// Demo user credentials
export const demoUsers = {
  tenant1: {
    email: 'rajesh.kumar@email.com',
    password: 'tenant123',
    tenantId: '1',
    description: 'Tenant with e-NACH not registered (demo the registration flow)'
  },
  tenant2: {
    email: 'priya.patel@email.com', 
    password: 'lessee456',
    tenantId: '6',
    description: 'Lessee with e-NACH active'
  },
  admin: {
    email: 'admin@bmc.gov.in',
    password: 'admin123',
    description: 'Admin access'
  }
};

export const mockTenants: Tenant[] = [
  {
    id: '1',
    name: 'Rajesh Kumar',
    email: 'rajesh.kumar@email.com',
    password: 'tenant123',
    phone: '9876543210',
    propertyId: 'P001',
    propertyNo: 'BMC/SHOP/2024/001',
    propertyLocation: 'MP Nagar, Zone 1, Bhopal',
    rentAmount: 25000,
    outstandingAmount: 50000,
    contractStartDate: '2023-01-15',
    contractEndDate: '2026-01-14',
    eNachStatus: 'not_registered',
    contractStatus: 'active',
    occupantType: 'tenant',
    aadharNo: 'XXXX-XXXX-3210',
    panNo: 'ABCPK1234L',
    address: '45, Sector 5, MP Nagar, Bhopal - 462011',
  },
  {
    id: '2',
    name: 'Sunita Sharma',
    email: 'sunita.sharma@email.com',
    password: 'tenant123',
    phone: '9876543211',
    propertyId: 'P002',
    propertyNo: 'BMC/LEASE/2024/002',
    propertyLocation: 'Arera Colony, Zone 2, Bhopal',
    rentAmount: 18000,
    outstandingAmount: 36000,
    contractStartDate: '2022-06-01',
    contractEndDate: '2025-05-31',
    eNachStatus: 'pending',
    contractStatus: 'expiring_soon',
    occupantType: 'lessee',
    aadharNo: 'XXXX-XXXX-3211',
    panNo: 'DEFPS5678M',
    address: '12, E-5 Colony, Arera Colony, Bhopal - 462016',
  },
  {
    id: '3',
    name: 'Mohammed Farhan',
    email: 'farhan.m@email.com',
    password: 'tenant123',
    phone: '9876543212',
    propertyId: 'P003',
    propertyNo: 'BMC/COMM/2024/003',
    propertyLocation: 'New Market, Zone 3, Bhopal',
    rentAmount: 45000,
    outstandingAmount: 0,
    contractStartDate: '2024-01-01',
    contractEndDate: '2027-12-31',
    eNachStatus: 'active',
    contractStatus: 'active',
    occupantType: 'tenant',
    aadharNo: 'XXXX-XXXX-3212',
    panNo: 'GHIMF9012N',
    address: '78, New Market Road, Bhopal - 462001',
  },
  {
    id: '4',
    name: 'Kavita Joshi',
    email: 'kavita.joshi@email.com',
    password: 'tenant123',
    phone: '9876543213',
    propertyId: 'P004',
    propertyNo: 'BMC/LEASE/2024/004',
    propertyLocation: 'TT Nagar, Zone 1, Bhopal',
    rentAmount: 15000,
    outstandingAmount: 75000,
    contractStartDate: '2021-08-15',
    contractEndDate: '2024-08-14',
    eNachStatus: 'not_registered',
    contractStatus: 'expired',
    occupantType: 'lessee',
    aadharNo: 'XXXX-XXXX-3213',
    panNo: 'JKLKJ3456P',
    address: '23, TT Nagar Main Road, Bhopal - 462003',
  },
  {
    id: '5',
    name: 'Amit Singh',
    email: 'amit.singh@email.com',
    password: 'tenant123',
    phone: '9876543214',
    propertyId: 'P005',
    propertyNo: 'BMC/COMM/2024/005',
    propertyLocation: 'Bittan Market, Zone 4, Bhopal',
    rentAmount: 32000,
    outstandingAmount: 32000,
    contractStartDate: '2023-03-01',
    contractEndDate: '2026-02-28',
    eNachStatus: 'rejected',
    contractStatus: 'active',
    occupantType: 'tenant',
    aadharNo: 'XXXX-XXXX-3214',
    panNo: 'MNOAS7890Q',
    address: '56, Bittan Market, Bhopal - 462024',
  },
  {
    id: '6',
    name: 'Priya Patel',
    email: 'priya.patel@email.com',
    password: 'lessee456',
    phone: '9876543215',
    propertyId: 'P006',
    propertyNo: 'BMC/LEASE/2024/006',
    propertyLocation: 'Habibganj, Zone 2, Bhopal',
    rentAmount: 28000,
    outstandingAmount: 0,
    contractStartDate: '2023-06-01',
    contractEndDate: '2028-05-31',
    eNachStatus: 'active',
    contractStatus: 'active',
    occupantType: 'lessee',
    aadharNo: 'XXXX-XXXX-3215',
    panNo: 'PQRPP1234R',
    address: '89, Habibganj Road, Bhopal - 462024',
  },
  {
    id: '7',
    name: 'Rahul Verma',
    email: 'rahul.verma@email.com',
    password: 'tenant123',
    phone: '9876543216',
    propertyId: 'P007',
    propertyNo: 'BMC/SHOP/2024/007',
    propertyLocation: 'Shahpura, Zone 3, Bhopal',
    rentAmount: 20000,
    outstandingAmount: 20000,
    contractStartDate: '2024-02-01',
    contractEndDate: '2027-01-31',
    eNachStatus: 'pending',
    contractStatus: 'active',
    occupantType: 'tenant',
    aadharNo: 'XXXX-XXXX-3216',
    panNo: 'STVRV5678S',
    address: '34, Shahpura Main Road, Bhopal - 462039',
  },
  {
    id: '8',
    name: 'Meena Gupta',
    email: 'meena.gupta@email.com',
    password: 'tenant123',
    phone: '9876543217',
    propertyId: 'P008',
    propertyNo: 'BMC/LEASE/2024/008',
    propertyLocation: 'Kolar Road, Zone 4, Bhopal',
    rentAmount: 35000,
    outstandingAmount: 70000,
    contractStartDate: '2022-01-01',
    contractEndDate: '2027-12-31',
    eNachStatus: 'active',
    contractStatus: 'active',
    occupantType: 'lessee',
    aadharNo: 'XXXX-XXXX-3217',
    panNo: 'UVWMG9012T',
    address: '67, Kolar Road, Bhopal - 462042',
  },
];

export const mockProperties: Property[] = [
  {
    id: 'P001',
    propertyNo: 'BMC/SHOP/2024/001',
    location: 'MP Nagar, Zone 1, Bhopal',
    area: 500,
    category: 'Commercial Shop',
    rentRate: 25000,
    escalationRate: 10,
    securityDeposit: 150000,
    status: 'occupied',
    propertyType: 'rent',
    zone: 'Zone 1',
    ward: 'Ward 45',
  },
  {
    id: 'P002',
    propertyNo: 'BMC/LEASE/2024/002',
    location: 'Arera Colony, Zone 2, Bhopal',
    area: 350,
    category: 'Commercial Shop',
    rentRate: 18000,
    escalationRate: 8,
    securityDeposit: 108000,
    status: 'occupied',
    propertyType: 'lease',
    zone: 'Zone 2',
    ward: 'Ward 32',
  },
  {
    id: 'P003',
    propertyNo: 'BMC/COMM/2024/003',
    location: 'New Market, Zone 3, Bhopal',
    area: 800,
    category: 'Commercial Complex',
    rentRate: 45000,
    escalationRate: 12,
    securityDeposit: 270000,
    status: 'occupied',
    propertyType: 'rent',
    zone: 'Zone 3',
    ward: 'Ward 18',
  },
  {
    id: 'P004',
    propertyNo: 'BMC/LEASE/2024/004',
    location: 'TT Nagar, Zone 1, Bhopal',
    area: 250,
    category: 'Commercial Shop',
    rentRate: 15000,
    escalationRate: 5,
    securityDeposit: 90000,
    status: 'occupied',
    propertyType: 'lease',
    zone: 'Zone 1',
    ward: 'Ward 42',
  },
  {
    id: 'P005',
    propertyNo: 'BMC/COMM/2024/005',
    location: 'Bittan Market, Zone 4, Bhopal',
    area: 600,
    category: 'Commercial Complex',
    rentRate: 32000,
    escalationRate: 10,
    securityDeposit: 192000,
    status: 'occupied',
    propertyType: 'rent',
    zone: 'Zone 4',
    ward: 'Ward 55',
  },
  {
    id: 'P006',
    propertyNo: 'BMC/LEASE/2024/006',
    location: 'Habibganj, Zone 2, Bhopal',
    area: 450,
    category: 'Commercial Shop',
    rentRate: 28000,
    escalationRate: 10,
    securityDeposit: 168000,
    status: 'occupied',
    propertyType: 'lease',
    zone: 'Zone 2',
    ward: 'Ward 28',
  },
  {
    id: 'P007',
    propertyNo: 'BMC/SHOP/2024/007',
    location: 'Shahpura, Zone 3, Bhopal',
    area: 300,
    category: 'Commercial Shop',
    rentRate: 20000,
    escalationRate: 8,
    securityDeposit: 120000,
    status: 'occupied',
    propertyType: 'rent',
    zone: 'Zone 3',
    ward: 'Ward 22',
  },
  {
    id: 'P008',
    propertyNo: 'BMC/LEASE/2024/008',
    location: 'Kolar Road, Zone 4, Bhopal',
    area: 700,
    category: 'Commercial Complex',
    rentRate: 35000,
    escalationRate: 12,
    securityDeposit: 210000,
    status: 'occupied',
    propertyType: 'lease',
    zone: 'Zone 4',
    ward: 'Ward 60',
  },
];

export const mockPayments: Payment[] = [
  {
    id: 'PAY001',
    tenantId: '1',
    tenantName: 'Rajesh Kumar',
    propertyNo: 'BMC/SHOP/2024/001',
    amount: 25000,
    paymentDate: '2024-11-05',
    paymentMode: 'online',
    status: 'success',
    transactionId: 'TXN2024110500001',
    receiptNo: 'RCP/2024/001',
    billingPeriod: 'November 2024',
  },
  {
    id: 'PAY002',
    tenantId: '2',
    tenantName: 'Sunita Sharma',
    propertyNo: 'BMC/LEASE/2024/002',
    amount: 18000,
    paymentDate: '2024-11-03',
    paymentMode: 'online',
    status: 'success',
    transactionId: 'TXN2024110300002',
    receiptNo: 'RCP/2024/002',
    billingPeriod: 'November 2024',
  },
  {
    id: 'PAY003',
    tenantId: '3',
    tenantName: 'Mohammed Farhan',
    propertyNo: 'BMC/COMM/2024/003',
    amount: 45000,
    paymentDate: '2024-11-01',
    paymentMode: 'enach',
    status: 'success',
    transactionId: 'TXN2024110100003',
    receiptNo: 'RCP/2024/003',
    billingPeriod: 'November 2024',
  },
  {
    id: 'PAY004',
    tenantId: '5',
    tenantName: 'Amit Singh',
    propertyNo: 'BMC/COMM/2024/005',
    amount: 32000,
    paymentDate: '2024-10-28',
    paymentMode: 'enach',
    status: 'failed',
    transactionId: 'TXN2024102800004',
    receiptNo: '',
    billingPeriod: 'October 2024',
  },
  {
    id: 'PAY005',
    tenantId: '6',
    tenantName: 'Priya Patel',
    propertyNo: 'BMC/LEASE/2024/006',
    amount: 28000,
    paymentDate: '2024-11-05',
    paymentMode: 'enach',
    status: 'success',
    transactionId: 'TXN2024110500005',
    receiptNo: 'RCP/2024/005',
    billingPeriod: 'November 2024',
  },
  {
    id: 'PAY006',
    tenantId: '6',
    tenantName: 'Priya Patel',
    propertyNo: 'BMC/LEASE/2024/006',
    amount: 28000,
    paymentDate: '2024-10-05',
    paymentMode: 'enach',
    status: 'success',
    transactionId: 'TXN2024100500006',
    receiptNo: 'RCP/2024/006',
    billingPeriod: 'October 2024',
  },
  {
    id: 'PAY007',
    tenantId: '1',
    tenantName: 'Rajesh Kumar',
    propertyNo: 'BMC/SHOP/2024/001',
    amount: 25000,
    paymentDate: '2024-10-05',
    paymentMode: 'online',
    status: 'success',
    transactionId: 'TXN2024100500007',
    receiptNo: 'RCP/2024/007',
    billingPeriod: 'October 2024',
  },
  {
    id: 'PAY008',
    tenantId: '8',
    tenantName: 'Meena Gupta',
    propertyNo: 'BMC/LEASE/2024/008',
    amount: 35000,
    paymentDate: '2024-11-05',
    paymentMode: 'enach',
    status: 'success',
    transactionId: 'TXN2024110500008',
    receiptNo: 'RCP/2024/008',
    billingPeriod: 'November 2024',
  },
];

export const mockENachMandates: ENachMandate[] = [
  {
    id: 'NACH001',
    mandateId: 'UMRN2024003001',
    tenantId: '3',
    tenantName: 'Mohammed Farhan',
    propertyNo: 'BMC/COMM/2024/003',
    amount: 45000,
    frequency: 'monthly',
    bankName: 'ICICI Bank',
    registrationDate: '2024-01-05',
    status: 'active',
    umrn: 'UMRN2024003001',
    accountNo: 'XXXX5678',
    ifscCode: 'ICIC0001234',
  },
  {
    id: 'NACH002',
    mandateId: 'UMRN2024002002',
    tenantId: '2',
    tenantName: 'Sunita Sharma',
    propertyNo: 'BMC/LEASE/2024/002',
    amount: 18000,
    frequency: 'monthly',
    bankName: 'HDFC Bank',
    registrationDate: '2024-10-15',
    status: 'pending',
    accountNo: 'XXXX4321',
    ifscCode: 'HDFC0001234',
  },
  {
    id: 'NACH003',
    mandateId: 'UMRN2024006003',
    tenantId: '6',
    tenantName: 'Priya Patel',
    propertyNo: 'BMC/LEASE/2024/006',
    amount: 28000,
    frequency: 'monthly',
    bankName: 'State Bank of India',
    registrationDate: '2023-06-10',
    status: 'active',
    umrn: 'UMRN2024006003',
    accountNo: 'XXXX9876',
    ifscCode: 'SBIN0001234',
  },
  {
    id: 'NACH004',
    mandateId: 'UMRN2024005004',
    tenantId: '5',
    tenantName: 'Amit Singh',
    propertyNo: 'BMC/COMM/2024/005',
    amount: 32000,
    frequency: 'monthly',
    bankName: 'Punjab National Bank',
    registrationDate: '2024-09-01',
    status: 'rejected',
    accountNo: 'XXXX1111',
    ifscCode: 'PUNB0001234',
  },
  {
    id: 'NACH005',
    mandateId: 'UMRN2024007005',
    tenantId: '7',
    tenantName: 'Rahul Verma',
    propertyNo: 'BMC/SHOP/2024/007',
    amount: 20000,
    frequency: 'monthly',
    bankName: 'Axis Bank',
    registrationDate: '2024-11-01',
    status: 'pending',
    accountNo: 'XXXX2222',
    ifscCode: 'UTIB0001234',
  },
  {
    id: 'NACH006',
    mandateId: 'UMRN2024008006',
    tenantId: '8',
    tenantName: 'Meena Gupta',
    propertyNo: 'BMC/LEASE/2024/008',
    amount: 35000,
    frequency: 'monthly',
    bankName: 'Bank of Baroda',
    registrationDate: '2022-01-15',
    status: 'active',
    umrn: 'UMRN2024008006',
    accountNo: 'XXXX3333',
    ifscCode: 'BARB0001234',
  },
];

export const mockNotices: Notice[] = [
  {
    id: 'NOT001',
    tenantId: '4',
    tenantName: 'Kavita Joshi',
    propertyNo: 'BMC/LEASE/2024/004',
    type: 'overdue',
    issueDate: '2024-10-20',
    serveDate: '2024-10-22',
    acknowledged: true,
    content: 'Your lease payment of ₹15,000 for the month of October 2024 is overdue. Please clear the dues immediately to avoid further action.',
  },
  {
    id: 'NOT002',
    tenantId: '5',
    tenantName: 'Amit Singh',
    propertyNo: 'BMC/COMM/2024/005',
    type: 'reminder',
    issueDate: '2024-11-01',
    acknowledged: false,
    content: 'This is a friendly reminder that your rent payment of ₹32,000 for November 2024 is due on 5th November.',
  },
  {
    id: 'NOT003',
    tenantId: '4',
    tenantName: 'Kavita Joshi',
    propertyNo: 'BMC/LEASE/2024/004',
    type: 'final_notice',
    issueDate: '2024-11-10',
    acknowledged: false,
    content: 'FINAL NOTICE: Your total outstanding dues of ₹75,000 must be cleared within 7 days. Failure to pay will result in lock and seal action.',
  },
  {
    id: 'NOT004',
    tenantId: '1',
    tenantName: 'Rajesh Kumar',
    propertyNo: 'BMC/SHOP/2024/001',
    type: 'reminder',
    issueDate: '2024-11-25',
    acknowledged: false,
    content: 'Reminder: Your rent payment of ₹25,000 for December 2024 will be due on 5th December. Please ensure timely payment.',
  },
  {
    id: 'NOT005',
    tenantId: '8',
    tenantName: 'Meena Gupta',
    propertyNo: 'BMC/LEASE/2024/008',
    type: 'overdue',
    issueDate: '2024-11-15',
    serveDate: '2024-11-17',
    acknowledged: true,
    content: 'Your lease payment of ₹35,000 for October 2024 is overdue. Outstanding amount: ₹70,000. Please clear immediately.',
  },
];

export const dashboardStats = {
  admin: {
    totalTenants: 86,
    totalLessees: 70,
    activeMandates: 98,
    pendingMandates: 23,
    failedMandates: 12,
    totalCollectedToday: 425000,
    totalCollectedMonth: 8750000,
    totalCollectedYear: 95000000,
    totalArrears: 3250000,
    expiringContracts: 8,
    eNachSuccessRate: 94.5,
  },
  collectionByZone: [
    { zone: 'Zone 1', amount: 2500000 },
    { zone: 'Zone 2', amount: 1800000 },
    { zone: 'Zone 3', amount: 2200000 },
    { zone: 'Zone 4', amount: 1500000 },
    { zone: 'Zone 5', amount: 750000 },
  ],
  monthlyTrend: [
    { month: 'Jan', collection: 7500000, arrears: 2800000 },
    { month: 'Feb', collection: 7800000, arrears: 2600000 },
    { month: 'Mar', collection: 8200000, arrears: 2400000 },
    { month: 'Apr', collection: 8000000, arrears: 2500000 },
    { month: 'May', collection: 8500000, arrears: 2200000 },
    { month: 'Jun', collection: 8100000, arrears: 2300000 },
    { month: 'Jul', collection: 8400000, arrears: 2100000 },
    { month: 'Aug', collection: 8600000, arrears: 2000000 },
    { month: 'Sep', collection: 8300000, arrears: 2200000 },
    { month: 'Oct', collection: 8750000, arrears: 1900000 },
    { month: 'Nov', collection: 8750000, arrears: 1800000 },
  ],
};

export const banks = [
  'State Bank of India',
  'HDFC Bank',
  'ICICI Bank',
  'Punjab National Bank',
  'Bank of Baroda',
  'Axis Bank',
  'Kotak Mahindra Bank',
  'Union Bank of India',
  'Canara Bank',
  'Bank of India',
];

// Helper function to get occupant type label
export const getOccupantLabel = (type: OccupantType): string => {
  return type === 'tenant' ? 'Tenant' : 'Lessee';
};

export const getOccupantTypeFromProperty = (propertyNo: string): OccupantType => {
  return propertyNo.includes('LEASE') ? 'lessee' : 'tenant';
};
