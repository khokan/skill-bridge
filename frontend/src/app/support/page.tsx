import { Metadata } from "next";
import { Mail, MessageSquare, Clock, AlertCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Support — SkillBridge",
  description: "Contact our support team for assistance with your account or platform issues.",
};

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            Support
          </h1>
          <p className="mt-4 text-lg text-slate-600">
            Get in touch with our support team — we're here to help
          </p>
        </div>

        {/* Support Channels */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 mb-12">
          <div className="rounded-lg border border-slate-200 bg-white p-6 text-center shadow-sm hover:shadow-md transition-shadow">
            <Mail className="h-8 w-8 text-primary mx-auto mb-4" />
            <h3 className="font-semibold text-slate-900">Email</h3>
            <p className="mt-2 text-sm text-slate-600">support@skillbridge.com</p>
            <p className="mt-1 text-xs text-slate-500">Response in 24 hours</p>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-6 text-center shadow-sm hover:shadow-md transition-shadow">
            <MessageSquare className="h-8 w-8 text-primary mx-auto mb-4" />
            <h3 className="font-semibold text-slate-900">Live Chat</h3>
            <p className="mt-2 text-sm text-slate-600">Chat with us now</p>
            <p className="mt-1 text-xs text-slate-500">Mon-Fri, 9AM-6PM UTC</p>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-6 text-center shadow-sm hover:shadow-md transition-shadow">
            <Clock className="h-8 w-8 text-primary mx-auto mb-4" />
            <h3 className="font-semibold text-slate-900">Response Time</h3>
            <p className="mt-2 text-sm text-slate-600">Average 2 hours</p>
            <p className="mt-1 text-xs text-slate-500">During business hours</p>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-6 text-center shadow-sm hover:shadow-md transition-shadow">
            <AlertCircle className="h-8 w-8 text-primary mx-auto mb-4" />
            <h3 className="font-semibold text-slate-900">Emergency</h3>
            <p className="mt-2 text-sm text-slate-600">+1 (234) 567-890</p>
            <p className="mt-1 text-xs text-slate-500">Available 24/7</p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="rounded-lg border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="mb-6 text-2xl font-semibold text-slate-900">Send us a Message</h2>
          <form className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="your@email.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-slate-700 mb-2">
                Subject
              </label>
              <input
                type="text"
                id="subject"
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="How can we help?"
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-2">
                Message
              </label>
              <textarea
                id="message"
                rows={6}
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                placeholder="Tell us more about your issue..."
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Send Message
            </button>
          </form>
        </div>

        {/* FAQ Link */}
        <div className="mt-12 text-center">
          <p className="text-slate-600 mb-4">Check out our FAQ for quick answers</p>
          <a
            href="/faq"
            className="inline-block rounded-lg border border-primary px-6 py-3 font-semibold text-primary hover:bg-primary/5 transition-colors"
          >
            View FAQ
          </a>
        </div>
      </div>
    </div>
  );
}
