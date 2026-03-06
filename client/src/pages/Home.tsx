import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowRight, Baby, BookOpen, Briefcase, Home, Heart, Users, Search, Bell, User, Globe } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";

const lifeEvents = [
  {
    id: "family",
    title: "Starting a Family",
    description: "Birth registration, child benefits, healthcare",
    icon: Baby,
    color: "from-pink-500 to-rose-500",
    services: ["Birth Registration", "Child Benefits", "Healthcare Services", "Parental Leave"]
  },
  {
    id: "education",
    title: "Education",
    description: "School enrollment, scholarships, certificates",
    icon: BookOpen,
    color: "from-blue-500 to-cyan-500",
    services: ["School Enrollment", "Scholarships", "Educational Certificates", "Skills Training"]
  },
  {
    id: "employment",
    title: "Employment",
    description: "Job search, unemployment benefits, training",
    icon: Briefcase,
    color: "from-green-500 to-emerald-500",
    services: ["Job Search Portal", "Unemployment Benefits", "Skills Training", "Work Permits"]
  },
  {
    id: "housing",
    title: "Housing",
    description: "Property registration, utility connections",
    icon: Home,
    color: "from-orange-500 to-amber-500",
    services: ["Property Registration", "Utility Connections", "Housing Loans", "Permits"]
  },
  {
    id: "business",
    title: "Business",
    description: "Business registration, licenses, tax",
    icon: Briefcase,
    color: "from-purple-500 to-violet-500",
    services: ["Business Registration", "Licenses & Permits", "Tax Registration", "Compliance"]
  },
  {
    id: "retirement",
    title: "Retirement",
    description: "Pensions, elderly care, social security",
    icon: Heart,
    color: "from-red-500 to-pink-500",
    services: ["Pension Services", "Elderly Care", "Social Security", "Healthcare"]
  }
];

const quickServices = [
  { name: "National ID Card", icon: User },
  { name: "Passport Services", icon: Users },
  { name: "Tax Filing", icon: Briefcase },
  { name: "Utility Bills", icon: Home }
];

const announcements = [
  {
    title: "New Digital ID System Launched",
    date: "March 5, 2026",
    description: "Introducing the new eGov.bd Digital ID for seamless government services access."
  },
  {
    title: "Tax Filing Deadline Extended",
    date: "March 1, 2026",
    description: "The tax filing deadline has been extended to March 31, 2026."
  },
  {
    title: "Online Passport Application Now Available",
    date: "February 28, 2026",
    description: "Apply for your passport online without visiting the office."
  }
];

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const { language, toggleLanguage, t } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
        <div className="container max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-emerald-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">ই</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">{t('header.title')}</h1>
              <p className="text-xs text-slate-500">{t('header.subtitle')}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative p-2 text-slate-600 hover:text-slate-900 transition">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <button className="p-2 text-slate-600 hover:text-slate-900 transition">
              <User className="w-5 h-5" />
            </button>
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition"
              title={t('header.language')}
            >
              <Globe className="w-4 h-4" />
              <span className="font-bold">{language.toUpperCase()}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section with Search */}
      <section className="bg-gradient-to-r from-green-600 to-emerald-600 text-white py-12 md:py-16">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="max-w-2xl">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              {t('home.hero.title')}
            </h2>
            <p className="text-lg text-green-100 mb-8">
              {t('home.hero.description')}
            </p>
            
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <Input
                type="text"
                placeholder={t('home.search.placeholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-3 w-full rounded-lg text-slate-900 placeholder-slate-500"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="container max-w-7xl mx-auto px-4 py-12">
        {/* Quick Links */}
        <section className="mb-16">
          <h3 className="text-2xl font-bold text-slate-900 mb-6">{t('home.quickAccess')}</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickServices.map((service) => (
              <button
                key={service.name}
                className="p-4 bg-white border border-slate-200 rounded-lg hover:border-green-500 hover:shadow-md transition text-left group"
              >
                <service.icon className="w-6 h-6 text-green-600 mb-2 group-hover:scale-110 transition" />
                <p className="text-sm font-medium text-slate-900">{service.name}</p>
              </button>
            ))}
          </div>
        </section>

        {/* Life Events Section */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-2xl font-bold text-slate-900">{t('home.lifeEvents')}</h3>
              <p className="text-slate-600 mt-1">{t('home.lifeEvents.description')}</p>
            </div>
            <Link href="/services">
              <Button variant="outline" className="gap-2">
                {t('home.viewAllServices')} <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {lifeEvents.map((event) => {
              const Icon = event.icon;
              return (
                <Card
                  key={event.id}
                  className="hover:shadow-lg transition cursor-pointer border-slate-200 overflow-hidden group"
                  onClick={() => setSelectedEvent(event.id)}
                >
                  <div className={`h-1 bg-gradient-to-r ${event.color}`}></div>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className={`p-3 rounded-lg bg-gradient-to-br ${event.color} text-white`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-green-600 group-hover:translate-x-1 transition" />
                    </div>
                <CardTitle className="text-lg mt-4">{t(`home.${event.id}.title` as any)}</CardTitle>
                <CardDescription>{t(`home.${event.id}.description` as any)}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {event.services.map((service, idx) => (
                        <div key={service} className="flex items-center gap-2 text-sm text-slate-600">
                          <div className="w-1.5 h-1.5 rounded-full bg-green-600"></div>
                          {t(`home.${event.id}.service${idx + 1}` as any)}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Announcements Section */}
        <section className="mb-16">
          <h3 className="text-2xl font-bold text-slate-900 mb-6">{t('home.announcements')}</h3>
          <div className="space-y-4">
            {announcements.map((announcement, index) => (
              <Card key={index} className="border-slate-200 hover:shadow-md transition">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{announcement.title}</CardTitle>
                      <CardDescription className="text-xs mt-1">{announcement.date}</CardDescription>
                    </div>
                  </div>
                  <p className="text-slate-600 mt-2 text-sm">{announcement.description}</p>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>

        {/* Call to Action */}
        <section className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-8 text-center">
          <h3 className="text-2xl font-bold text-slate-900 mb-2">{t('home.cta.title')}</h3>
          <p className="text-slate-600 mb-6">{t('home.cta.description')}</p>
          <div className="flex gap-4 justify-center">
            <Button className="bg-green-600 hover:bg-green-700">{t('home.cta.createAccount')}</Button>
            <Button variant="outline">{t('home.cta.learnMore')}</Button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-12 mt-16">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="text-white font-bold mb-4">{t('footer.about')}</h4>
              <p className="text-sm">{t('footer.about.description')}</p>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">{t('footer.services')}</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">{t('footer.serviceDirectory')}</a></li>
                <li><a href="#" className="hover:text-white transition">{t('footer.myDashboard')}</a></li>
                <li><a href="#" className="hover:text-white transition">{t('footer.myDocuments')}</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">{t('footer.support')}</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">{t('footer.helpCenter')}</a></li>
                <li><a href="#" className="hover:text-white transition">{t('footer.contactUs')}</a></li>
                <li><a href="#" className="hover:text-white transition">{t('footer.faqs')}</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">{t('footer.legal')}</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">{t('footer.privacyPolicy')}</a></li>
                <li><a href="#" className="hover:text-white transition">{t('footer.termsOfService')}</a></li>
                <li><a href="#" className="hover:text-white transition">{t('footer.accessibility')}</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-700 pt-8 text-center text-sm">
            <p>{t('footer.copyright')}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
