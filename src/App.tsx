import { Route, Routes } from "react-router-dom";
import familyErrandsImage from "./assets/family-errands-concierge.png";
import governmentServicesImage from "./assets/government-services.png";
import landPropertyPurchaseImage from "./assets/land-property-purchase.png";
import Layout from "./layouts/Layout";
import AllSelectedServices from "./pages/AllSelectedServices";
import Auth from "./pages/Auth/Auth";
import Home from "./pages/Home";
import HowItWorks from "./pages/HowItWorks";
import InvestmentServicePage from "./pages/InvestmentServicePage";
import Account from "./pages/Account";
import { Toaster } from "sonner";
import AdminLogin from "./pages/Admin/AdminLogin";
import Dash from "./pages/Admin/Dash";
import AdminLayout from "./layouts/AdminLayout";
import Categories from "./pages/Admin/Categories";
import SelectedService from "./pages/SelectedService";
import BuildingConsultancy from "./pages/BuildingConsultancy";
import ServiceLandingPage from "./pages/ServiceLandingPage";

function App() {
  return (
    <>
    <Toaster position="top-right" richColors />
      <Routes>
        <Route path="admin/login" element={<AdminLogin />} />
        <Route path="admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<Dash />} />
          <Route path="categories" element={<Categories />} />
        </Route>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="how-it-works" element={<HowItWorks />} />
          <Route path="investment" element={<InvestmentServicePage />} />
          <Route
            path="building-consultancy"
            element={<BuildingConsultancy />}
          />
          <Route
            path="land-property-purchase"
            element={
              <ServiceLandingPage
                title="Land & Property"
                includedDetails={[
                  "Official Search at County & Ministry of Lands (Ardhi House)",
                  "Green Card history & encumbrance audit",
                  "Physical survey & beacon verification with registered surveyor",
                  "Seller identity & spouse consent verification",
                  "Comprehensive Legal Risk Report with Advocate Stamp",
                ]}
                whatsappMessage="Hello, I would like to ask about land and property purchase support."
                image={landPropertyPurchaseImage}
                imageAlt="A modern house and undeveloped land in Nairobi"
              />
            }
          />
          <Route
            path="family-errands-concierge"
            element={
              <ServiceLandingPage
                title="Family Errands"
                includedDetails={[
                  "Contractor and tradesperson supervision for repairs and home maintenance, helping prevent overcharging and substandard work.",
                  "Document collection and attestation from local government offices.",
                  "School and tuition support, including fee payments, progress reports, uniforms, and school supplies.",
                  "Legal and banking representation, including notarized power-of-attorney submissions, local bank account support, and estate matters.",
                ]}
                whatsappMessage="Hello, I would like to ask about family errands and concierge support."
                image={familyErrandsImage}
                imageAlt="A person carrying shopping bags from a car"
              />
            }
          />
          <Route
            path="government-services"
            element={
              <ServiceLandingPage
                title="Government Services"
                includedDetails={[
                  "Property Conveyancing & Sale Agreements by LSK Advocate",
                  "Power of Attorney (POA) registration and attestation",
                  "Succession & Estate dispute resolution representation",
                  "Commercial contracts & partnership agreements",
                  "1-on-1 Confidential Legal Consultation via Zoom/Teams",
                  "Certificate of No Impediment filing at Sheria House / AG Office",
                  "Dual Citizenship Declaration & Endorsement",
                  "Fast-tracked Kenyan Passport & ID renewals liaison",
                  "Ministry of Foreign Affairs document attestation & apostille",
                  "Safe courier dispatch of physical certificates to your overseas address",
                ]}
                whatsappMessage="Hello, I would like to ask about government services support."
                image={governmentServicesImage}
                imageAlt="Kenyan national identity cards and a Huduma Kenya service centre"
              />
            }
          />
          <Route path="services" element={<AllSelectedServices />} />
          <Route
            path="services/:categoryId"
            element={<SelectedService />}
          />
          <Route path="login" element={<Auth />} />
          <Route path="register" element={<Auth />} />
          <Route path="account" element={<Account />} />
          <Route path="requests" element={<Account />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
