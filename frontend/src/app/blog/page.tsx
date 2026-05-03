import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog — SkillBridge",
  description: "Learn from our latest articles on tutoring, education, and learning tips.",
};

export default function BlogPage() {
  const posts = [
    {
      id: 1,
      title: "5 Tips for Effective Online Learning",
      excerpt: "Discover proven strategies to maximize your learning experience with online tutors.",
      date: "May 2, 2026",
      author: "Sarah Johnson",
      category: "Education",
    },
    {
      id: 2,
      title: "How to Find the Right Tutor for You",
      excerpt: "A comprehensive guide to selecting the perfect tutor based on your learning goals.",
      date: "April 28, 2026",
      author: "Michael Chen",
      category: "Guidance",
    },
    {
      id: 3,
      title: "The Future of Education Technology",
      excerpt: "Exploring how AI and technology are transforming the education landscape.",
      date: "April 15, 2026",
      author: "Emily Rodriguez",
      category: "Technology",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            SkillBridge Blog
          </h1>
          <p className="mt-4 text-lg text-slate-600">
            Tips, insights, and stories about learning and tutoring
          </p>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <article
              key={post.id}
              className="group overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="aspect-video bg-gradient-to-br from-blue-400 to-purple-500" />
              <div className="p-6">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wide text-primary">
                    {post.category}
                  </span>
                  <span className="text-sm text-slate-500">{post.date}</span>
                </div>
                <h3 className="mb-3 text-xl font-semibold text-slate-900 group-hover:text-primary transition-colors">
                  {post.title}
                </h3>
                <p className="mb-4 text-sm text-slate-600">{post.excerpt}</p>
                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <span className="text-sm text-slate-500">{post.author}</span>
                  <a href="#" className="text-sm font-semibold text-primary hover:text-primary/80">
                    Read More →
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* More Posts CTA */}
        <div className="mt-16 text-center">
          <p className="text-slate-600 mb-4">More posts coming soon...</p>
          <a
            href="/"
            className="inline-block rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Back to Home
          </a>
        </div>
      </div>
    </div>
  );
}
