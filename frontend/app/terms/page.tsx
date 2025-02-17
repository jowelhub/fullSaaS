import { Metadata } from "next";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";

export const metadata: Metadata = {
  title: "Terms of Service - SaaSFlow",
  description: "Our Terms of Service for using SaaSFlow.",
};

export default function TermsPage() {
  return (
    <div>
      <Navigation />
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-4">Terms of Service</h1>
        <p className="mb-4">
          Please read these terms of service carefully before using our platform.
        </p>
        <h2 className="text-2xl font-semibold mb-2">1. Acceptance of Terms</h2>
        <p className="mb-4">
          By accessing and using SaaSFlow ("the Platform"), you agree to be bound
          by these Terms of Service and all applicable laws and regulations. If
          you do not agree with any of these terms, you are prohibited from
          using the Platform.
        </p>
        <h2 className="text-2xl font-semibold mb-2">2. Use License</h2>
        <p className="mb-4">
          Permission is granted to temporarily access and use the Platform for
          personal, non-commercial transitory viewing only. This is the grant of
          a license, not a transfer of title, and under this license you may
          not:
        </p>
        <ul className="list-disc pl-8 mb-4">
          <li>modify or copy the materials</li>
          <li>use the materials for any commercial purpose</li>
          <li>attempt to decompile or reverse engineer any software</li>
          <li>remove any copyright or other proprietary notations</li>
          <li>transfer the materials to another person</li>
        </ul>
        <h2 className="text-2xl font-semibold mb-2">3. Disclaimer</h2>
        <p className="mb-4">
          The materials on the Platform are provided on an 'as is' basis.
          SaaSFlow makes no warranties, expressed or implied, and hereby
          disclaims and negates all other warranties including, without
          limitation, implied warranties or conditions of merchantability, fitness
          for a particular purpose, or non-infringement of intellectual property
          or other violation of rights.
        </p>
        <h2 className="text-2xl font-semibold mb-2">4. Limitations</h2>
        <p className="mb-4">
          In no event shall SaaSFlow or its suppliers be liable for any damages
          (including, without limitation, damages for loss of data or profit, or
          due to business interruption) arising out of the use or inability to
          use the materials on SaaSFlow's Internet site, even if SaaSFlow or a
          SaaSFlow authorized representative has been notified orally or in
          writing of the possibility of such damage.
        </p>
        {/* Add more terms as needed */}
      </div>
      <Footer />
    </div>
  );
}
