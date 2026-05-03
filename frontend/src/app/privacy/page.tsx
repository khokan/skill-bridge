import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — SkillBridge",
  description: "SkillBridge privacy policy and how we protect your data.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="mb-2 text-4xl font-bold tracking-tight text-slate-900">Privacy Policy</h1>
        <p className="mb-8 text-slate-600">Last updated: May 2, 2026</p>

        <div className="prose prose-slate max-w-none space-y-8 text-slate-600">
          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">1. Introduction</h2>
            <p>
              SkillBridge ("we," "us," "our," or "Company") is committed to protecting your privacy.
              This Privacy Policy explains how we collect, use, disclose, and safeguard your
              information when you use our website and services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">2. Information We Collect</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">Personal Information</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Name, email address, phone number</li>
                  <li>Account credentials and profile information</li>
                  <li>Payment information and billing address</li>
                  <li>Educational background and learning goals</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">Automatically Collected</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Browser and device information</li>
                  <li>IP address and location data</li>
                  <li>Usage patterns and analytics</li>
                  <li>Cookies and similar tracking technologies</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">3. How We Use Your Information</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>To provide and improve our tutoring services</li>
              <li>To process payments and send invoices</li>
              <li>To communicate with you about your account</li>
              <li>To personalize your experience</li>
              <li>To comply with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">4. Data Security</h2>
            <p>
              We implement comprehensive security measures including encryption, secure servers, and
              access controls to protect your personal information. However, no method of transmission
              over the Internet is completely secure.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">5. Your Rights</h2>
            <p>
              You have the right to access, correct, delete, or transfer your personal information.
              To exercise these rights, please contact us at privacy@skillbridge.com.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">6. Contact Us</h2>
            <p>
              If you have questions about this Privacy Policy, please contact us at:
              <br />
              Email: privacy@skillbridge.com
              <br />
              Address: 123 Education Street, Tech City, TC 12345
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
