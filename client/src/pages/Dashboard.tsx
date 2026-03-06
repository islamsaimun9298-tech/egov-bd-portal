import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, Calendar, Clock, FileText, User, Download, CheckCircle, AlertCircle } from "lucide-react";
import { Link } from "wouter";

const applications = [
  {
    id: 1,
    name: "National ID Card Application",
    status: "approved",
    submittedDate: "2026-02-15",
    expectedDate: "2026-03-10",
    progress: 100
  },
  {
    id: 2,
    name: "Passport Application",
    status: "under-review",
    submittedDate: "2026-02-20",
    expectedDate: "2026-03-20",
    progress: 65
  },
  {
    id: 3,
    name: "Tax Return Filing",
    status: "pending",
    submittedDate: "2026-03-01",
    expectedDate: "2026-03-15",
    progress: 30
  }
];

const documents = [
  { name: "National ID Card", type: "Identity", uploadedDate: "2026-01-10" },
  { name: "Birth Certificate", type: "Identity", uploadedDate: "2025-12-05" },
  { name: "Educational Certificate", type: "Education", uploadedDate: "2025-11-20" },
  { name: "Driving License", type: "License", uploadedDate: "2025-10-15" }
];

const upcomingDates = [
  { event: "Tax Filing Deadline", date: "2026-03-31", daysLeft: 25 },
  { event: "License Renewal", date: "2026-04-15", daysLeft: 40 },
  { event: "Utility Bill Due", date: "2026-03-20", daysLeft: 14 }
];

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
        <div className="container max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">My Dashboard</h1>
            <p className="text-slate-600 text-sm">Welcome back, Ahmed Hassan</p>
          </div>
          <Link href="/">
            <Button variant="outline">Back to Home</Button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="container max-w-7xl mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Hello, Ahmed Hassan!</h2>
          <p className="text-slate-600">Here's what you need to know today</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="border-slate-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600">Active Applications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">3</div>
              <p className="text-xs text-slate-500 mt-1">2 pending, 1 approved</p>
            </CardContent>
          </Card>

          <Card className="border-slate-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600">Documents Stored</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">4</div>
              <p className="text-xs text-slate-500 mt-1">All verified</p>
            </CardContent>
          </Card>

          <Card className="border-slate-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600">Upcoming Dates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-600">3</div>
              <p className="text-xs text-slate-500 mt-1">Next in 14 days</p>
            </CardContent>
          </Card>

          <Card className="border-slate-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600">Notifications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600">2</div>
              <p className="text-xs text-slate-500 mt-1">Unread messages</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="applications" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6 bg-slate-100 p-1 rounded-lg">
            <TabsTrigger value="applications">My Applications</TabsTrigger>
            <TabsTrigger value="documents">My Documents</TabsTrigger>
            <TabsTrigger value="dates">Important Dates</TabsTrigger>
          </TabsList>

          {/* Applications Tab */}
          <TabsContent value="applications" className="space-y-4">
            <div className="space-y-4">
              {applications.map((app) => (
                <Card key={app.id} className="border-slate-200 hover:shadow-md transition">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{app.name}</CardTitle>
                        <CardDescription className="text-xs mt-1">
                          Submitted on {app.submittedDate}
                        </CardDescription>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${
                        app.status === 'approved' ? 'bg-green-100 text-green-800' :
                        app.status === 'under-review' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {app.status === 'approved' && <CheckCircle className="w-3 h-3" />}
                        {app.status === 'under-review' && <Clock className="w-3 h-3" />}
                        {app.status === 'pending' && <AlertCircle className="w-3 h-3" />}
                        {app.status.replace('-', ' ').toUpperCase()}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-slate-600">Progress</span>
                          <span className="font-medium">{app.progress}%</span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2">
                          <div
                            className="bg-green-600 h-2 rounded-full transition-all"
                            style={{ width: `${app.progress}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-600">Expected completion: {app.expectedDate}</span>
                        <Button size="sm" variant="outline">View Details</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Documents Tab */}
          <TabsContent value="documents" className="space-y-4">
            <div className="space-y-3">
              {documents.map((doc, index) => (
                <Card key={index} className="border-slate-200">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-blue-600" />
                        <div>
                          <p className="font-medium text-slate-900">{doc.name}</p>
                          <p className="text-xs text-slate-500">{doc.type} • Uploaded {doc.uploadedDate}</p>
                        </div>
                      </div>
                      <Button size="sm" variant="outline" className="gap-1">
                        <Download className="w-4 h-4" /> Download
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <Button className="w-full bg-green-600 hover:bg-green-700">Upload New Document</Button>
          </TabsContent>

          {/* Important Dates Tab */}
          <TabsContent value="dates" className="space-y-4">
            <div className="space-y-3">
              {upcomingDates.map((item, index) => (
                <Card key={index} className="border-slate-200">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Calendar className="w-5 h-5 text-orange-600" />
                        <div>
                          <p className="font-medium text-slate-900">{item.event}</p>
                          <p className="text-sm text-slate-600">{item.date}</p>
                        </div>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                        item.daysLeft <= 7 ? 'bg-red-100 text-red-800' :
                        item.daysLeft <= 14 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {item.daysLeft} days left
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-8 mt-16">
        <div className="container max-w-7xl mx-auto px-4 text-center text-sm">
          <p>&copy; 2026 eGov.bd - Government of Bangladesh. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
