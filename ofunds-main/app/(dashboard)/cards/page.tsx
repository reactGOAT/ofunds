import type { Metadata } from "next";
import CardsClient from "./client";

export const metadata: Metadata = {
  title: "Cards - Winners Chapel",
  description: "Manage your Ofunds Cards",
};

export default function CardsPage() {
  return <CardsClient />;
}
