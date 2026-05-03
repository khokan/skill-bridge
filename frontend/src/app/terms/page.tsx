import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service — SkillBridge",
  description: "SkillBridge terms of service and conditions of use.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="mb-2 text-4xl font-bold tracking-tight text-slate-900">Terms of Service</h1>
        <p className="mb-8 text-slate-600">Last updated: May 2, 2026</p>

        <div className="prose prose-slate max-w-none space-y-8 text-slate-600">
          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">1. Acceptance of Terms</h2>
            <p>
              By accessing and using SkillBridge, you accept and agree to be bound by the terms and
              provision of this agreement. If you do not agree to abide by the above, please do not
              use this service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">2. Use License</h2>
            <p>
              Permission is granted to temporarily download one copy of the materials (information or
              software) on SkillBridge for personal, non-commercial transitory viewing only. This is
              the grant of a license, not a transfer of title.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">3. Disclaimer</h2>
            <p>
              The materials on SkillBridge's website are provided on an 'as is' basis. SkillBridge
              makes no warranties, expressed or implied, and hereby disclaims and negates all other
              warranties including, without limitation, implied warranties or conditions of
              merchantability, fitness for a particular purpose, or non-infringement of intellectual
              property or other violation of rights.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">4. Limitations</h2>
            <p>
              In no event shall SkillBridge or its suppliers be liable for any damages (including,
              without limitation, damages for loss of data or profit, or due to business
              interruption) arising out of the use or inability to use the materials on SkillBridge's
              website, even if SkillBridge or an authorized representative has been notified orally
              or in writing of the possibility of such damage.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">5. Accuracy of Materials</h2>
            <p>
              The materials appearing on SkillBridge's website could include technical, typographical,
              or photographic errors. SkillBridge does not warrant that any of the materials on its
              website are accurate, complete, or current. SkillBridge may make changes to the
              materials contained on its website at any time without notice.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">6. Links</h2>
            <p>
              SkillBridge has not reviewed all of the sites linked to its website and is not
              responsible for the contents of any such linked site. The inclusion of any link does
              not imply endorsement by SkillBridge of the site. Use of any such linked website is at
              the user's own risk.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">7. Modifications</h2>
            <p>
              SkillBridge may revise these terms of service for its website at any time without
              notice. By using this website, you are agreeing to be bound by the then current version
              of these terms of service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">8. Governing Law</h2>
            <p>
              These terms and conditions are governed by and construed in accordance with the laws of
              the jurisdiction in which SkillBridge operates, and you irrevocably submit to the
              exclusive jurisdiction of the courts in that location.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
