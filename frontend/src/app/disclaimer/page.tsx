import { Metadata } from "next";
import { AlertCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Disclaimer — SkillBridge",
  description: "SkillBridge disclaimer and important legal notice.",
};

export default function DisclaimerPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-start gap-4 rounded-lg bg-amber-50 p-6 border border-amber-200">
          <AlertCircle className="h-6 w-6 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <h2 className="font-semibold text-amber-900">Important Notice</h2>
            <p className="mt-2 text-sm text-amber-800">
              Please read this disclaimer carefully before using SkillBridge services.
            </p>
          </div>
        </div>

        <h1 className="mb-2 text-4xl font-bold tracking-tight text-slate-900">Disclaimer</h1>
        <p className="mb-8 text-slate-600">Last updated: May 2, 2026</p>

        <div className="prose prose-slate max-w-none space-y-8 text-slate-600">
          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">1. Service Disclaimer</h2>
            <p>
              SkillBridge provides a platform for connecting students with tutors. The tutoring
              services are provided by independent tutors and are not directly provided by SkillBridge.
              SkillBridge does not guarantee any specific outcomes or results from tutoring sessions.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">2. No Warranties</h2>
            <p>
              SkillBridge and its tutors provide their services "as is" without warranty of any kind.
              We do not guarantee:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>Academic success or grade improvement</li>
              <li>Uninterrupted or error-free service</li>
              <li>The quality or appropriateness of tutors</li>
              <li>Specific learning outcomes or results</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">3. Tutor Verification</h2>
            <p>
              While SkillBridge verifies tutor credentials and background information, we make no
              guarantee about tutor qualifications or teaching abilities. It is your responsibility to
              evaluate whether a tutor is suitable for your needs.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">4. Content Disclaimer</h2>
            <p>
              SkillBridge does not review or endorse all educational materials provided by tutors.
              You use such materials at your own discretion. SkillBridge is not responsible for the
              accuracy or appropriateness of educational content.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">5. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by law, SkillBridge shall not be liable for any
              indirect, incidental, special, or consequential damages arising from your use of or
              inability to use the platform or services, including but not limited to:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>Loss of academic opportunity</li>
              <li>Poor grades or academic performance</li>
              <li>Loss of revenue or business opportunity</li>
              <li>Loss of data or information</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">6. Third-Party Links</h2>
            <p>
              SkillBridge may contain links to third-party websites. We are not responsible for the
              content, accuracy, or practices of these external sites. Use of third-party links is at
              your own risk.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">7. Age Restrictions</h2>
            <p>
              SkillBridge is intended for users age 13 and above. If you are under 13, parental
              consent is required. Users are responsible for providing accurate information about
              their age.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">8. Changes to Disclaimer</h2>
            <p>
              SkillBridge reserves the right to modify this disclaimer at any time. Changes will be
              effective immediately upon posting to the website. Your continued use of SkillBridge
              following any changes constitutes your acceptance of the modified disclaimer.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">9. Questions?</h2>
            <p>
              If you have questions about this disclaimer, please contact us at:
              <br />
              Email: legal@skillbridge.com
              <br />
              Address: 123 Education Street, Tech City, TC 12345
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
