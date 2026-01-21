import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

/*
   IN-MEMORY TENANT DATA
*/
let tenants = [
   {
    "id": 4,
    "name": "MOHIT JAIN",
    "email": "mohit.jain@example.com",
    "propertyNo": "L000000120",
    "propertyLocation": "New Market, TT Nagar, Bhopal, 462003",
    "rentAmount": 3200.0,
    "outstandingAmount": 0.0,
    "eNachStatus": "not_registered",
    "contractStatus": "active"
  }
  ,
  {
    "id": 5,
    "name": "ANITA PATEL",
    "email": "anita.patel@example.com",
    "propertyNo": "L000000121",
    "propertyLocation": "Kolar Road, Bhopal, 462042",
    "rentAmount": 6000.0,
    "outstandingAmount": 3000.0,
    "eNachStatus": "active",
    "contractStatus": "expiring_soon"
  }
 
];

/*  ROUTES */
app.
get("/api/tenants",
   (req, res) => {
  res.json(tenants);
});

app.post("/api/tenants",
   (req, res) => {
  
  const tenantData = Array.isArray(req.body) ? req.body[0] : req.body;
  
  const newTenant = {
    id: tenants.length ? tenants[tenants.length - 1].id + 1 : 1,
    name: tenantData.name,
    email: tenantData.email,
    propertyNo: tenantData.propertyNo,
    propertyLocation: tenantData.propertyLocation,
    rentAmount: tenantData.rentAmount,
    outstandingAmount: tenantData.outstandingAmount,
    eNachStatus: tenantData.eNachStatus,
    contractStatus: tenantData.contractStatus
  };
  
  tenants.push(newTenant);
  res.status(201).json(newTenant);
});

app.put("/api/tenants/:id", (req, res) => {
  const id = Number(req.params.id);
  const index = tenants.findIndex(t => t.id === id);

  if (index === -1) {
    return res.status(404).json({ message: "Tenant not found" });
  }

  tenants[index] = { ...tenants[index], ...req.body };
  res.json(tenants[index]);
});

app.delete("/api/tenants/:id", (req, res) => {
  const id = Number(req.params.id);
  tenants = tenants.filter(t => t.id !== id);
  res.json({ message: "Tenant deleted" });
});

/* =========================
   IN-MEMORY PROPERTY DATA
========================= */
let properties = [
  {
    id: "P001",
    propertyNo: "BMC/SHOP/2024/001",
    location: "MP Nagar, Zone 1, Bhopal",
    area: 500,
    category: "Commercial Shop",
    rentRate: 25000,
    escalationRate: 10,
    securityDeposit: 150000,
    status: "occupied",
    propertyType: "rent",
    zone: "Zone 1",
    ward: "Ward 45"
  },
  {
    id: "P002",
    propertyNo: "BMC/LEASE/2024/002",
    location: "Arera Colony, Zone 2, Bhopal",
    area: 350,
    category: "Commercial Shop",
    rentRate: 18000,
    escalationRate: 8,
    securityDeposit: 108000,
    status: "occupied",
    propertyType: "lease",
    zone: "Zone 2",
    ward: "Ward 32"
  },
  {
    id: "P003",
    propertyNo: "BMC/COMM/2024/003",
    location: "New Market, Zone 3, Bhopal",
    area: 800,
    category: "Commercial Complex",
    rentRate: 45000,
    escalationRate: 12,
    securityDeposit: 270000,
    status: "occupied",
    propertyType: "rent",
    zone: "Zone 3",
    ward: "Ward 18"
  },
  {
    id: "P004",
    propertyNo: "BMC/LEASE/2024/004",
    location: "TT Nagar, Zone 1, Bhopal",
    area: 250,
    category: "Commercial Shop",
    rentRate: 15000,
    escalationRate: 5,
    securityDeposit: 90000,
    status: "occupied",
    propertyType: "lease",
    zone: "Zone 1",
    ward: "Ward 42"
  },
  {
    id: "P005",
    propertyNo: "BMC/COMM/2024/005",
    location: "Bittan Market, Zone 4, Bhopal",
    area: 600,
    category: "Commercial Complex",
    rentRate: 32000,
    escalationRate: 10,
    securityDeposit: 192000,
    status: "occupied",
    propertyType: "rent",
    zone: "Zone 4",
    ward: "Ward 55"
  }
];

/* =========================
   PROPERTY ROUTES
========================= */
app.get("/api/properties", (req, res) => {
  res.json(properties);
});

app.post("/api/properties", (req, res) => {
  const propertyData = Array.isArray(req.body) ? req.body[0] : req.body;
  
  const newProperty = {
    id: `P${String(properties.length + 1).padStart(3, '0')}`,
    propertyNo: propertyData.propertyNo,
    location: propertyData.location,
    area: propertyData.area,
    category: propertyData.category,
    rentRate: propertyData.rentRate,
    escalationRate: propertyData.escalationRate,
    securityDeposit: propertyData.securityDeposit,
    status: propertyData.status || "vacant",
    propertyType: propertyData.propertyType || "rent",
    zone: propertyData.zone,
    ward: propertyData.ward
  };
  
  properties.push(newProperty);
  res.status(201).json(newProperty);
});

app.put("/api/properties/:id", (req, res) => {
  const id = req.params.id;
  const index = properties.findIndex(p => p.id === id);

  if (index === -1) {
    return res.status(404).json({ message: "Property not found" });
  }

  properties[index] = { ...properties[index], ...req.body };
  res.json(properties[index]);
});

app.delete("/api/properties/:id", (req, res) => {
  const id = req.params.id;
  properties = properties.filter(p => p.id !== id);
  res.json({ message: "Property deleted" });
});

/* =========================
   START SERVER
========================= */
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
