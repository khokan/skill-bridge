import { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ — SkillBridge",
  description: "Frequently asked questions about SkillBridge tutoring platform.",
};

export default function FAQPage() {
  const faqs = [
    {
      question: "How do I find a tutor?",
      answer:
        "Browse our catalog of tutors, filter by subject, availability, and price. You can also use our AI assistant in the chat widget to get personalized recommendations based on your needs.",
    },
    {
      question: "How much does tutoring cost?",
      answer:
        "Tutor rates vary based on expertise and experience. Most tutors charge between $20-100 per hour. You can see rates clearly on each tutor's profile before booking.",
    },
    {
      question: "Can I cancel a session?",
      answer:
        "Yes, you can cancel sessions with at least 24 hours notice for a full refund. Cancellations within 24 hours may be subject to a cancellation fee.",
    },
    {
      question: "Are sessions recorded?",
      answer:
        "Sessions can be recorded with the tutor's permission. You'll have access to recordings for review, but they're only for your personal learning purposes.",
    },
    {
      question: "How do I report a problem?",
      answer:
        "If you encounter any issues, use our support form or email support@skillbridge.com. Our team will investigate and follow up within 24 hours.",
    },
    {
      question: "Is my payment information secure?",
      answer:
        "Yes, we use industry-standard encryption and partner with trusted payment providers. Your financial information is never shared with tutors.",
    },
    {
      question: "What if I'm not satisfied with a session?",
      answer:
        "If you're unsatisfied, contact support within 48 hours. We'll work with you to either find a new tutor or provide a refund.",
    },
    {
      question: "Can I become a tutor?",
      answer:
        "Yes! If you're interested in tutoring, visit our 'Become a Tutor' page to apply. We verify all tutors to ensure quality and safety.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            Frequently Asked Questions
          </h1>
          <p className="mt-4 text-lg text-slate-600">
            Find answers to common questions about SkillBridge
          </p>
        </div>

        {/* FAQ List */}
        <div className="space-y-6">
          {faqs.map((faq, idx) => (
            <details
              key={idx}
              className="group rounded-lg border border-slate-200 bg-white shadow-sm hover:shadow-md transition-shadow"
            >
              <summary className="flex cursor-pointer items-center justify-between p-6 font-semibold text-slate-900 hover:text-primary transition-colors">
                {faq.question}
                <span className="text-slate-400 group-open:text-primary transition-transform group-open:rotate-180">
                  ↓
                </span>
              </summary>
              <div className="border-t border-slate-200 bg-slate-50 px-6 py-4 text-slate-600">
                {faq.answer}
              </div>
            </details>
          ))}
        </div>

        {/* Still Have Questions */}
        <div className="mt-16 rounded-lg bg-primary/10 p-8 text-center">
          <h3 className="mb-2 text-2xl font-semibold text-slate-900">Still have questions?</h3>
          <p className="mb-4 text-slate-600">
            Can't find the answer you're looking for? Contact our support team.
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
