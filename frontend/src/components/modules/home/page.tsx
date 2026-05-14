import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  CheckCircle,
  Clock,
  Star,
  Users,
  BookOpen,
  TrendingUp,
  Zap,
  Shield,
  Bot,
  Award,
  Target,
  AlertCircle,
  Heart,
  Headphones,
  Search,
} from "lucide-react";
import FeaturedTutorSlider from "./FeaturedTutorSlider";
import OpenAiChatButton from "./OpenAiChatButton";
import { tutorService } from "@/services/tutor.service";

export default async function HomePage() {
  // Fetch real tutors from DB
  const { data: tutorsData } = await tutorService.getTutors();
  const featuredTutors = Array.isArray(tutorsData) ? tutorsData.slice(0, 8) : [];

  const subjects = [
    { name: "Mathematics", tutors: 42, icon: "∑" },
    { name: "Physics", tutors: 28, icon: "⚛" },
    { name: "English", tutors: 35, icon: "📚" },
    { name: "Chemistry", tutors: 19, icon: "🧪" },
    { name: "Computer Science", tutors: 31, icon: "💻" },
    { name: "Languages", tutors: 46, icon: "🗣" },
    { name: "Business", tutors: 23, icon: "💼" },
    { name: "Art & Music", tutors: 27, icon: "🎨" },
  ];

  return (
    <div className="mx-auto w-11/12 px-4 sm:px-6 lg:px-8 py-12 space-y-20">
      {/* ================= SECTION 1: PREMIUM HERO WITH SLIDER ================= */}
      <section className="relative overflow-hidden py-12 px-6 sm:px-8 lg:px-10">
        <div className="absolute inset-0 bg-linear-to-br from-primary/20 via-primary/5 to-primary/10 rounded-3xl" />
        <div className="space-y-8 relative">
          {/* Hero Content */}
          <div className="grid items-center gap-12 lg:gap-16 lg:grid-cols-2">
            <div className="space-y-8 animate-fade-in">
              <div className="space-y-6">
                <Badge variant="outline" className="px-4 py-2 text-sm font-semibold animate-slide-up border-primary/50 bg-primary/5">
                  <Zap className="mr-2 h-4 w-4" />
                  Premium Learning Platform
                </Badge>
                
                <h1 className="text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl lg:text-6xl animate-slide-up leading-tight">
                  Elevate Your Potential with{" "}
                  <span className="text-transparent bg-clip-text bg-linear-to-r from-primary via-primary to-primary/60">
                    World-Class Tutors
                  </span>
                </h1>
                
                <p className="text-xl text-slate-600 md:text-2xl max-w-2xl animate-slide-up leading-relaxed">
                  Access curated experts for any subject. Book live sessions instantly. Transform your learning journey with personalized guidance from top-rated professionals.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 animate-slide-up pt-2">
                <Button asChild size="lg" className="h-14 px-10 text-base font-semibold hover:shadow-xl transition-all hover:scale-105">
                  <Link href="/tutors">
                    <Search className="mr-3 h-5 w-5" />
                    Discover Expert Tutors
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="h-14 px-10 text-base font-semibold hover:border-primary hover:shadow-lg transition-all">
                  <Link href="/register/tutor">
                    <TrendingUp className="mr-3 h-5 w-5" />
                    Monetize Your Expertise
                  </Link>
                </Button>
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-col sm:flex-row gap-8 pt-4 animate-slide-up">
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-3">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Avatar key={i} className="border-3 border-background h-10 w-10 hover:scale-110 transition-transform cursor-pointer">
                        <AvatarFallback className="text-xs font-bold">{String.fromCharCode(64 + i)}</AvatarFallback>
                      </Avatar>
                    ))}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">5,000+ Active Learners</p>
                    <p className="text-xs text-slate-600">Learning right now</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex gap-1 bg-amber-50 px-3 py-2 rounded-lg">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">4.9/5 Rating</p>
                    <p className="text-xs text-slate-600">3,200+ reviews</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Premium Stats Box */}
            <div className="relative h-96 rounded-2xl bg-linear-to-br from-primary/30 via-primary/10 to-transparent border-2 border-primary/30 animate-float shadow-xl p-8">
              <div className="absolute inset-0 flex items-center justify-center opacity-20">
                <TrendingUp className="h-32 w-32 text-primary" />
              </div>
              <div className="relative space-y-6 text-center h-full flex flex-col justify-center">
                <div className="space-y-2">
                  <div className="text-5xl font-bold text-primary">500+</div>
                  <div className="text-slate-700 font-semibold">Expert Tutors</div>
                </div>
                <div className="border-t border-primary/20 pt-6 space-y-2">
                  <div className="text-4xl font-bold text-slate-900">50K+</div>
                  <div className="text-slate-700 font-semibold">Sessions Completed</div>
                </div>
              </div>
            </div>
          </div>

          {/* Featured Tutors Slider in Hero */}
          {featuredTutors.length > 0 && (
            <div className="pt-12 border-t border-primary/10">
              <div className="text-center space-y-4 mb-8">
                <h3 className="text-2xl font-bold text-slate-900">Meet Our Top Tutors</h3>
                <p className="text-slate-600">Browse elite tutors available for instant booking</p>
              </div>
              <FeaturedTutorSlider tutors={featuredTutors} />
            </div>
          )}
        </div>
      </section>

      {/* ================= SECTION 2: FEATURED TUTORS SLIDER ================= */}
      {featuredTutors.length > 0 && (
        <section className="space-y-6 py-8 px-6 sm:px-8 lg:px-10">
          <div className="text-center space-y-3">
            <Badge variant="secondary" className="px-3 py-1">
              <Star className="h-3 w-3 mr-1" />
              Top Rated
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Featured Tutors</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover our most experienced and highly-rated tutors
            </p>
          </div>
          <FeaturedTutorSlider tutors={featuredTutors} />
        </section>
      )}

 {/* ================= SECTION 5: POPULAR CATEGORIES ================= */}
      <section className="space-y-10 py-8 px-6 sm:px-8 lg:px-10">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Explore Popular Subjects
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Learn from experts across hundreds of subjects and skill areas
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {subjects.slice(0, 4).map((subject) => (
            <Card key={subject.name} className="rounded-xl border hover:border-primary/50 hover:shadow-md transition-all group hover:-translate-y-1">
              <CardContent className="p-6 text-center space-y-4">
                <div className="text-4xl mb-2 group-hover:scale-110 transition-transform">{subject.icon}</div>
                <div>
                  <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                    {subject.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {subject.tutors} expert tutors
                  </p>
                </div>
                <Button asChild variant="outline" size="sm" className="w-full">
                  <Link href={`/tutors?subject=${subject.name.toLowerCase()}`}>
                    Browse Tutors
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-3 grid-cols-2 sm:grid-cols-4 md:grid-cols-8">
          {subjects.map((subject) => (
            <Badge
              key={subject.name}
              variant="outline"
              className="px-3 py-2 text-sm font-normal hover:bg-primary/10 hover:text-primary cursor-pointer transition-all hover:-translate-y-1"
              asChild
            >
              <Link href={`/tutors?subject=${subject.name.toLowerCase()}`}>
                {subject.name}
              </Link>
            </Badge>
          ))}
        </div>
      </section>
      
      {/* ================= SECTION 3: AI CHATBOT FEATURE ================= */}
      <section className="grid gap-8 items-center lg:grid-cols-2 py-8 px-6 sm:px-8 lg:px-10">
        <div className="space-y-6">
          <Badge className="w-fit px-4 py-2 bg-blue-100 text-blue-700">
            <Bot className="h-4 w-4 mr-2" />
            AI Powered
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Smart Tutor Discovery with AI Chat
          </h2>
          <p className="text-lg text-muted-foreground">
            Can&apos;t decide which tutor is right for you? Use our AI-powered chatbot to get personalized recommendations based on your learning goals, preferred schedule, and budget.
          </p>

          <ul className="space-y-3">
            {[
              "Ask questions about tutor expertise and experience",
              "Get instant recommendations based on your preferences",
              "Check availability and pricing in real-time",
              "Compare tutors by subject, rating, and experience",
            ].map((feature, i) => (
              <li key={i} className="flex gap-3">
                <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span className="text-slate-700">{feature}</span>
              </li>
            ))}
          </ul>

          <OpenAiChatButton />
        </div>

        <Card className="border-2 border-blue-200 bg-linear-to-br from-blue-50 to-blue-100 p-8">
          <CardContent className="space-y-6">
            <div className="flex items-end gap-3">
              <div className="flex-1 bg-blue-100 rounded-lg p-3 text-sm">
                <p className="text-slate-700">Show me tutors with strong reviews in math</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Bot className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
              <div className="flex-1 bg-white rounded-lg p-3 text-sm space-y-2">
                <p className="font-medium text-slate-900">Found 12 tutors matching your criteria</p>
                <p className="text-slate-600 text-xs">Top recommendations: Sarah (4.9★), Alex (4.8★), Maria (4.7★)</p>
              </div>
            </div>

            <div className="bg-blue-500/10 border border-blue-200 rounded-lg p-3">
              <p className="text-xs text-slate-600">
                💡 The AI chatbot learns from your preferences to provide better recommendations over time
              </p>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* ================= SECTION 4: HOW IT WORKS ================= */}
      <section className="space-y-10 py-8 px-6 sm:px-8 lg:px-10">
        <div className="text-center space-y-4">
          <Badge variant="secondary" className="px-3 py-1">
            Simple Process
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            How SkillBridge Works
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            From finding the perfect tutor to mastering new skills—all in three simple steps
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              step: "01",
              title: "Find Your Expert",
              description: "Browse verified tutors by subject, rating, and availability. Use AI to get personalized suggestions.",
              icon: Search,
              color: "text-blue-600"
            },
            {
              step: "02",
              title: "Book Instantly",
              description: "Check real-time availability and book sessions with one click. No waiting for responses.",
              icon: Clock,
              color: "text-purple-600"
            },
            {
              step: "03",
              title: "Learn & Grow",
              description: "Join interactive sessions, track your progress, and achieve your learning goals.",
              icon: TrendingUp,
              color: "text-green-600"
            },
          ].map((item) => (
            <Card key={item.step} className="rounded-2xl border hover:shadow-lg transition-all group hover:border-primary/50">
              <CardContent className="p-8 space-y-4">
                <div className="flex items-center justify-between">
                  <div className={`text-2xl font-bold ${item.color}`}>{item.step}</div>
                  <div className="p-3 rounded-full bg-slate-100 group-hover:bg-primary/10 transition-colors">
                    <item.icon className={`h-6 w-6 ${item.color}`} />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
     

      {/* ================= SECTION 6: WHY CHOOSE SKILLBRIDGE ================= */}
      <section className="bg-muted/30 rounded-3xl p-8 md:p-12 space-y-10 py-8 mx-auto w-full">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Why Choose SkillBridge?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need for effective online learning
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[
            {
              icon: Shield,
              title: "Verified Tutors",
              description: "All tutors undergo thorough background checks and qualification verification",
            },
            {
              icon: Zap,
              title: "Instant Booking",
              description: "Book sessions in seconds with real-time availability",
            },
            {
              icon: Award,
              title: "Certified Experts",
              description: "Learn from certified professionals with years of experience",
            },
            {
              icon: Headphones,
              title: "24/7 Support",
              description: "Get help anytime from our dedicated support team",
            },
            {
              icon: Target,
              title: "Personalized Plans",
              description: "Customize your learning path based on your goals",
            },
            {
              icon: Heart,
              title: "Satisfaction Guaranteed",
              description: "If unsatisfied, we'll help you find a better fit or refund",
            },
          ].map((feature, i) => (
            <Card key={i} className="border hover:border-primary/50 hover:shadow-md transition-all">
              <CardContent className="p-6 space-y-3">
                <feature.icon className="h-8 w-8 text-primary" />
                <h3 className="font-semibold text-lg">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* ================= SECTION 7: TESTIMONIALS ================= */}
      <section className="space-y-10 py-8 px-6 sm:px-8 lg:px-10">
        <div className="text-center space-y-4">
          <Badge variant="secondary" className="px-3 py-1">
            Success Stories
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            What Learners Say
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Real testimonials from students who&apos;ve achieved their goals
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              text: "SkillBridge helped me find the perfect math tutor who improved my grades from C to A in just 3 months!",
              author: "Emma Johnson",
              role: "High School Student",
              rating: 5,
            },
            {
              text: "The AI chatbot saved me hours searching through tutors. I found someone perfect in minutes!",
              author: "Marcus Chen",
              role: "College Student",
              rating: 5,
            },
            {
              text: "Professional, reliable, and affordable. This platform changed how I approach learning.",
              author: "Sarah Williams",
              role: "Career Changer",
              rating: 5,
            },
          ].map((testimonial, i) => (
            <Card key={i} className="border hover:shadow-lg transition-shadow">
              <CardContent className="p-6 space-y-4">
                <div className="flex gap-1">
                  {[...Array(testimonial.rating)].map((_, j) => (
                    <Star key={j} className="h-4 w-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-slate-700 italic">&ldquo;{testimonial.text}&rdquo;</p>
                <div className="pt-2 border-t">
                  <p className="font-semibold text-slate-900">{testimonial.author}</p>
                  <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* ================= SECTION 8: STATS & COMMUNITY ================= */}
      <section className="rounded-3xl border bg-linear-to-br from-primary/5 to-primary/10 p-8 md:p-12 py-8 mx-auto w-full">
        <div className="text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Trusted by Our Community
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Join thousands of learners achieving their goals with SkillBridge
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-4">
            {[
              { value: "10,000+", label: "Active Learners", icon: Users },
              { value: "500+", label: "Expert Tutors", icon: Award },
              { value: "50,000+", label: "Sessions Completed", icon: BookOpen },
              { value: "4.8★", label: "Average Rating", icon: Star },
            ].map((stat) => (
              <div key={stat.label} className="text-center space-y-2 hover:scale-105 transition-transform">
                <div className="flex justify-center">
                  <div className="p-3 rounded-full bg-primary/10">
                    <stat.icon className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <div className="text-3xl font-bold">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= SECTION 10: FAQ PREVIEW ================= */}
      <section className="space-y-10 py-8 px-6 sm:px-8 lg:px-10">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Common Questions
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Have questions? Check out our FAQ page for more information
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 max-w-2xl mx-auto">
          {[
            {
              q: "How do I find the right tutor?",
              a: "Use our AI chatbot to get personalized recommendations, or browse tutors by subject and rating.",
            },
            {
              q: "What if I'm not satisfied with a tutor?",
              a: "We offer a satisfaction guarantee. If you're not happy, we'll help find a better fit or refund.",
            },
            {
              q: "How much does tutoring cost?",
              a: "Rates vary based on tutor expertise. Most tutors charge between $15-100 per hour.",
            },
            {
              q: "Can I cancel sessions?",
              a: "Yes, cancel with 24 hours notice for a full refund. Cancellations within 24 hours may have fees.",
            },
          ].map((item, i) => (
            <Card key={i} className="border hover:border-primary/50 transition-colors">
              <CardContent className="p-6 space-y-2">
                <h3 className="font-semibold flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  {item.q}
                </h3>
                <p className="text-sm text-muted-foreground pl-7">{item.a}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button asChild variant="outline" size="lg">
            <Link href="/faq">View All FAQs</Link>
          </Button>
        </div>
      </section>

      {/* ================= SECTION 9: NEWSLETTER CTA ================= */}
      <section className="bg-linear-to-r from-primary to-primary/80 rounded-3xl p-8 md:p-12 text-white space-y-6 mx-auto w-full">
        <div className="max-w-2xl mx-auto text-center space-y-4">
          <h2 className="text-3xl font-bold">Stay Updated with Learning Tips</h2>
          <p className="text-primary/90">
            Get weekly tips, new tutor introductions, and exclusive offers delivered to your inbox
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
          <input
            type="email"
            placeholder="Enter your email"
            className="flex-1 px-4 py-3 rounded-lg text-slate-900 placeholder-slate-500"
          />
          <Button size="lg" className="bg-white text-primary hover:bg-white/90">
            Subscribe
          </Button>
        </div>

        <p className="text-xs text-primary/80 text-center">
          No spam, ever. Unsubscribe anytime.
        </p>
      </section>

      {/* ================= SECTION 10: FINAL CTA ================= */}
      <section className="text-center space-y-8 py-8 px-6 sm:px-8 lg:px-10">
        <div className="space-y-4">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Ready to Start Your Learning Journey?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join thousands of learners achieving their goals. Whether you want to learn new skills or share your expertise, SkillBridge makes it simple.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" className="h-12 px-8">
            <Link href="/register/student">
              <Users className="mr-2 h-4 w-4" />
              Start Learning Free
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="h-12 px-8">
            <Link href="/register/tutor">
              <BookOpen className="mr-2 h-4 w-4" />
              Apply as Tutor
            </Link>
          </Button>
        </div>

        <div className="text-sm text-muted-foreground">
          <p>No credit card required • Cancel anytime • 24/7 support • AI-powered recommendations</p>
        </div>
      </section>
    </div>
  );
}