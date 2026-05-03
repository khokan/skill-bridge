import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cookie Policy — SkillBridge",
  description: "SkillBridge cookie policy and how we use cookies.",
};

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="mb-2 text-4xl font-bold tracking-tight text-slate-900">Cookie Policy</h1>
        <p className="mb-8 text-slate-600">Last updated: May 2, 2026</p>

        <div className="prose prose-slate max-w-none space-y-8 text-slate-600">
          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">1. What Are Cookies?</h2>
            <p>
              Cookies are small text files that are placed on your computer or mobile device when you
              visit a website. They are widely used to make websites work more efficiently and to
              provide information to the site owners.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">2. How We Use Cookies</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">Essential Cookies</h3>
                <p>
                  These cookies are necessary for the website to function properly. They enable you
                  to navigate the site and use essential features like authentication and account
                  management.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">Performance Cookies</h3>
                <p>
                  These cookies collect information about how you use our website, such as pages
                  visited and links clicked. This helps us improve website functionality.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">Analytics Cookies</h3>
                <p>
                  We use analytics to understand how visitors use our site. This helps us optimize
                  the user experience and measure the effectiveness of marketing campaigns.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">Marketing Cookies</h3>
                <p>
                  These cookies are used to deliver personalized advertisements and track the
                  effectiveness of advertising campaigns.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">3. Managing Cookies</h2>
            <p>
              Most web browsers allow you to control cookies through their settings. You can choose
              to accept or reject cookies, though doing so may affect your ability to use some
              features of our website. Instructions for managing cookies in popular browsers:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>Chrome: Settings  Privacy and Security Cookies</li>
              <li>Firefox: Preferences  Privacy & Security  Cookies</li>
              <li>Safari: Preferences  Privacy  Cookies and Website Data</li>
              <li>Edge: Settings  Privacy  Cookies</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">4. Third-Party Cookies</h2>
            <p>
              Some cookies may be set by third-party services we use, such as analytics providers and
              advertising networks. These third parties have their own privacy policies governing
              their use of cookies.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">5. Contact Us</h2>
            <p>
              If you have questions about our cookie policy, please contact us at:
              privacy@skillbridge.com
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
