import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, ArrowRight, Filter } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";

const services = {
  health: [
    { name: "Health Card Registration", description: "Register for government health services", ministry: "Ministry of Health" },
    { name: "Vaccination Records", description: "Access your vaccination history", ministry: "Ministry of Health" },
    { name: "Hospital Appointments", description: "Book appointments at government hospitals", ministry: "Ministry of Health" },
    { name: "Maternity Benefits", description: "Apply for maternity and child care benefits", ministry: "Ministry of Health" }
  ],
  education: [
    { name: "School Enrollment", description: "Enroll your child in government schools", ministry: "Ministry of Education" },
    { name: "Educational Scholarships", description: "Apply for various scholarship programs", ministry: "Ministry of Education" },
    { name: "Certificate Verification", description: "Verify educational certificates", ministry: "Ministry of Education" },
    { name: "Exam Results", description: "Check exam results and transcripts", ministry: "Ministry of Education" }
  ],
  finance: [
    { name: "Tax Filing (e-TIN)", description: "File your income tax returns online", ministry: "Ministry of Finance" },
    { name: "Tax Refund Status", description: "Check your tax refund status", ministry: "Ministry of Finance" },
    { name: "Business Tax Registration", description: "Register for business taxation", ministry: "Ministry of Finance" },
    { name: "VAT Registration", description: "Register for Value Added Tax", ministry: "Ministry of Finance" }
  ],
  land: [
    { name: "Property Registration", description: "Register your property ownership", ministry: "Ministry of Land" },
    { name: "Land Survey", description: "Request land survey and measurement", ministry: "Ministry of Land" },
    { name: "Title Deed Issuance", description: "Get your property title deed", ministry: "Ministry of Land" },
    { name: "Mutation Application", description: "Apply for property mutation", ministry: "Ministry of Land" }
  ],
  social: [
    { name: "Social Security Benefits", description: "Apply for social security allowances", ministry: "Ministry of Social Welfare" },
    { name: "Widow Allowance", description: "Apply for widow assistance programs", ministry: "Ministry of Social Welfare" },
    { name: "Disability Benefits", description: "Register for disability support services", ministry: "Ministry of Social Welfare" },
    { name: "Elderly Care Services", description: "Access elderly care and support", ministry: "Ministry of Social Welfare" }
  ],
  commerce: [
    { name: "Business Registration", description: "Register your business entity", ministry: "Ministry of Commerce" },
    { name: "Trade License", description: "Obtain trade license for your business", ministry: "Ministry of Commerce" },
    { name: "Export/Import License", description: "Apply for export-import permissions", ministry: "Ministry of Commerce" },
    { name: "Business Compliance", description: "Check business compliance requirements", ministry: "Ministry of Commerce" }
  ]
};

const categories = [
  { id: "health", label: "Health", count: 4 },
  { id: "education", label: "Education", count: 4 },
  { id: "finance", label: "Finance & Tax", count: 4 },
  { id: "land", label: "Land & Property", count: 4 },
  { id: "social", label: "Social Welfare", count: 4 },
  { id: "commerce", label: "Commerce", count: 4 }
];

export default function Services() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("health");

  const filteredServices = Object.entries(services).reduce((acc, [key, items]) => {
    acc[key as keyof typeof services] = items.filter(service =>
      service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return acc;
  }, {} as typeof services);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
        <div className="container max-w-7xl mx-auto px-4 py-4">
          <Link href="/">
            <Button variant="ghost" className="mb-4">← Back to Home</Button>
          </Link>
          <h1 className="text-3xl font-bold text-slate-900">Service Directory</h1>
          <p className="text-slate-600 mt-1">Browse all government services by category</p>
        </div>
      </header>

      {/* Search Bar */}
      <section className="bg-white border-b border-slate-200 py-6">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input
              type="text"
              placeholder="Search services by name or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-4 py-3 w-full rounded-lg text-slate-900"
            />
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="container max-w-7xl mx-auto px-4 py-12">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-6 mb-8 bg-slate-100 p-1 rounded-lg">
            {categories.map((category) => (
              <TabsTrigger
                key={category.id}
                value={category.id}
                className="text-xs md:text-sm"
              >
                {category.label}
                <span className="ml-1 text-xs bg-slate-300 px-2 py-0.5 rounded-full">
                  {filteredServices[category.id as keyof typeof services]?.length || 0}
                </span>
              </TabsTrigger>
            ))}
          </TabsList>

          {Object.entries(filteredServices).map(([categoryId, categoryServices]) => (
            <TabsContent key={categoryId} value={categoryId} className="space-y-4">
              {categoryServices.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {categoryServices.map((service, index) => (
                    <Card
                      key={index}
                      className="hover:shadow-lg transition border-slate-200 group cursor-pointer"
                    >
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-lg group-hover:text-green-600 transition">
                              {service.name}
                            </CardTitle>
                            <CardDescription className="text-xs mt-1">
                              {service.ministry}
                            </CardDescription>
                          </div>
                          <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-green-600 group-hover:translate-x-1 transition" />
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-slate-600 mb-4">{service.description}</p>
                        <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                          Access Service
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-slate-600">No services found matching your search.</p>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>

        {/* A-Z Index */}
        <section className="mt-16 pt-12 border-t border-slate-200">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">A-Z Service Index</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
            {['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'].map((letter) => (
              <button
                key={letter}
                className="p-3 bg-white border border-slate-200 rounded-lg hover:bg-green-50 hover:border-green-500 transition text-center font-medium text-slate-900"
              >
                {letter}
              </button>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-12 mt-16">
        <div className="container max-w-7xl mx-auto px-4 text-center">
          <p>&copy; 2026 eGov.bd - Government of Bangladesh. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
