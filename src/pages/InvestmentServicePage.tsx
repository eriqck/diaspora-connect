import investmentImage from "../assets/investment-types.png";
import type { HomeCategory } from "../apiservices/HomeService";
import SelectedService from "./SelectedService";

const investmentCategory: HomeCategory = {
  id: 0,
  name: "Investment",
  description:
    "Explore investment opportunities in Kenya and get local support to understand the options and coordinate your next steps.",
  image: investmentImage,
  services: [
    "Property",
    "Shares & Stocks",
    "Bonds & Interests",
    "Money Market Funds",
  ],
};

function InvestmentServicePage() {
  return <SelectedService categoryOverride={investmentCategory} />;
}

export default InvestmentServicePage;
