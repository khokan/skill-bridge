import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Help Center — SkillBridge",
  description: "Get help with your SkillBridge account and find answers to common questions.",
};

export default function HelpPage() {
  const topics = [
    {
      title: "Getting Started",
      items: [
        "Creating your account",
        "Setting up your profile",
        "Finding a tutor",
        "Booking your first session",
      ],
    },
    {
      title: "Account & Billing",
      items: [
        "Managing your account",
        "Payment methods",
        "Subscription plans",
        "Cancellation & refunds",
      ],
    },
    {
      title: "Sessions & Learning",
      items: [
        "Preparing for sessions",
        "Technical requirements",
        "Recording sessions",
        "Progress tracking",
      ],
    },
    {
      title: "Safety & Trust",
      items: [
        "Tutor verification",
        "Safety guidelines",
        "Reporting issues",
        "Data privacy",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            Help Center
          </h1>
          <p className="mt-4 text-lg text-slate-600">
            Find answers to your questions about SkillBridge
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-12">
          <div className="relative">
            <input
              type="text"
              placeholder="Search for help..."
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>

        {/* Help Topics */}
        <div className="grid gap-8 md:grid-cols-2">
          {topics.map((topic, idx) => (
            <div
              key={idx}
              className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <h3 className="mb-4 text-lg font-semibold text-slate-900">{topic.title}</h3>
              <ul className="space-y-2">
                {topic.items.map((item, itemIdx) => (
                  <li key={itemIdx}>
                    <a
                      href="#"
                      className="text-slate-600 hover:text-primary transition-colors flex items-center gap-2"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact Support */}
        <div className="mt-16 rounded-lg bg-primary/10 p-8 text-center">
          <h3 className="mb-2 text-2xl font-semibold text-slate-900">Still need help?</h3>
          <p className="mb-4 text-slate-600">
            Our support team is here to help you. Contact us anytime.
          </p>
          <a
            href="/support"
            className="inline-block rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Contact Support
          </a>
        </div>
      </div>
    </div>
  );
}
