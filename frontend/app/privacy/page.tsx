import { Metadata } from "next";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";

export const metadata: Metadata = {
  title: "Privacy Policy - SaaSFlow",
  description: "Our Privacy Policy for SaaSFlow.",
};

export default function PrivacyPage() {
  return (
    <div>
      <Navigation />
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>
        <p className="mb-4">
          Your privacy is important to us. This Privacy Policy explains how we
          collect, use, and protect your personal information.
        </p>
        <h2 className="text-2xl font-semibold mb-2">1. Information We Collect</h2>
        <p className="mb-4">
          We collect information you provide directly to us, such as when you
          register for an account, create or modify your profile, access and use
          our Services.
        </p>
        <h2 className="text-2xl font-semibold mb-2">2. How We Use Your Information</h2>
        <p className="mb-4">
          We use the information we collect to operate and improve our Services,
          personalize your experience, and communicate with you.
        </p>
        <h2 className="text-2xl font-semibold mb-2">3. Data Security</h2>
        <p className="mb-4">
          We take reasonable measures to protect your personal information from
          unauthorized access, use, or disclosure.
        </p>
        {/* Add more privacy details as needed */}
      </div>
      <Footer />
    </div>
  );
}
