import { Metadata } from "next";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";

export const metadata: Metadata = {
  title: "Contact Us - SaaSFlow",
  description: "Contact SaaSFlow for support or inquiries.",
};

export default function ContactPage() {
  return (
    <div>
      <Navigation />
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-4">Contact Us</h1>
        <p className="mb-4">
          Have questions or need assistance? Contact us using the information
          below.
        </p>
        <div className="mb-4">
          <h2 className="text-2xl font-semibold mb-2">Contact Information</h2>
          <p>Email: support@saasflow.com</p>
          <p>Phone: (123) 456-7890</p>
          <p>Address: 123 Main Street, Anytown, USA</p>
        </div>
        {/* Add a contact form if desired */}
      </div>
      <Footer />
    </div>
  );
}
