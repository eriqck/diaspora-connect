export type ServiceCategory = {
  name: string;
  items: string[];
};

export const serviceCategories: ServiceCategory[] = [
  {
    name: "Events Organisation",
    items: ["Weddings", "Graduations", "Family celebrations", "Corporate events"],
  },
  {
    name: "Government Erands",
    items: ["Document collection", "Licence applications", "Certificate follow-ups", "Official searches"],
  },
  {
    name: "Tours & Travel",
    items: ["Custom itineraries", "Hotel bookings", "Safari packages", "Local transport"],
  },
  {
    name: "Construction",
    items: ["Project supervision", "Renovations", "Site inspections", "Contractor sourcing"],
  },
  {
    name: "Real Estate",
    items: ["Property viewings", "Property management", "Land searches", "Tenant support"],
  },
  {
    name: "Legal Services",
    items: ["Document review", "Conveyancing", "Succession support", "Legal consultations"],
  },
  {
    name: "Healthcare",
    items: ["Appointments", "Medical escorts", "Home care support", "Prescription delivery"],
  },
  {
    name: "Education",
    items: ["School applications", "Fee payments", "Student welfare", "Document collection"],
  },
  {
    name: "Shopping & Delivery",
    items: ["Personal shopping", "Gift delivery", "Household supplies", "Secure courier"],
  },
  {
    name: "Airport Transfers",
    items: ["Airport pickup", "Airport drop-off", "Meet and greet", "Group transfers"],
  },
  {
    name: "Relocation Support",
    items: ["Home search", "Utility setup", "Moving services", "Settling-in support"],
  },
];
