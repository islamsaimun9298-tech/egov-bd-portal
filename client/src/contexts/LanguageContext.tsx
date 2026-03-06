import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'bn';

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  en: {
    // Header
    'header.title': 'eGov.bd',
    'header.subtitle': 'Government Services Portal',
    'header.notifications': 'Notifications',
    'header.profile': 'Profile',
    'header.language': 'Language',

    // Home Page
    'home.hero.title': 'Find Government Services Easily',
    'home.hero.description': 'Access all government services in one place. From birth registration to business licenses.',
    'home.search.placeholder': 'Search services, documents, or life events...',
    
    'home.quickAccess': 'Quick Access',
    'home.quickAccess.nationalId': 'National ID Card',
    'home.quickAccess.passport': 'Passport Services',
    'home.quickAccess.tax': 'Tax Filing',
    'home.quickAccess.utility': 'Utility Bills',

    'home.lifeEvents': 'Life Events',
    'home.lifeEvents.description': 'Find services relevant to your life situation',
    'home.viewAllServices': 'View All Services',

    'home.family': 'Starting a Family',
    'home.family.description': 'Birth registration, child benefits, healthcare',
    'home.family.service1': 'Birth Registration',
    'home.family.service2': 'Child Benefits',
    'home.family.service3': 'Healthcare Services',
    'home.family.service4': 'Parental Leave',

    'home.education': 'Education',
    'home.education.description': 'School enrollment, scholarships, certificates',
    'home.education.service1': 'School Enrollment',
    'home.education.service2': 'Scholarships',
    'home.education.service3': 'Educational Certificates',
    'home.education.service4': 'Skills Training',

    'home.employment': 'Employment',
    'home.employment.description': 'Job search, unemployment benefits, training',
    'home.employment.service1': 'Job Search Portal',
    'home.employment.service2': 'Unemployment Benefits',
    'home.employment.service3': 'Skills Training',
    'home.employment.service4': 'Work Permits',

    'home.housing': 'Housing',
    'home.housing.description': 'Property registration, utility connections',
    'home.housing.service1': 'Property Registration',
    'home.housing.service2': 'Utility Connections',
    'home.housing.service3': 'Housing Loans',
    'home.housing.service4': 'Permits',

    'home.business': 'Business',
    'home.business.description': 'Business registration, licenses, tax',
    'home.business.service1': 'Business Registration',
    'home.business.service2': 'Licenses & Permits',
    'home.business.service3': 'Tax Registration',
    'home.business.service4': 'Compliance',

    'home.retirement': 'Retirement',
    'home.retirement.description': 'Pensions, elderly care, social security',
    'home.retirement.service1': 'Pension Services',
    'home.retirement.service2': 'Elderly Care',
    'home.retirement.service3': 'Social Security',
    'home.retirement.service4': 'Healthcare',

    'home.announcements': 'Latest Announcements',
    'home.announcement1.title': 'New Digital ID System Launched',
    'home.announcement1.date': 'March 5, 2026',
    'home.announcement1.description': 'Introducing the new eGov.bd Digital ID for seamless government services access.',

    'home.announcement2.title': 'Tax Filing Deadline Extended',
    'home.announcement2.date': 'March 1, 2026',
    'home.announcement2.description': 'The tax filing deadline has been extended to March 31, 2026.',

    'home.announcement3.title': 'Online Passport Application Now Available',
    'home.announcement3.date': 'February 28, 2026',
    'home.announcement3.description': 'Apply for your passport online without visiting the office.',

    'home.cta.title': 'New to eGov.bd?',
    'home.cta.description': 'Create your account to access personalized services and track your applications.',
    'home.cta.createAccount': 'Create Account',
    'home.cta.learnMore': 'Learn More',

    // Footer
    'footer.about': 'About eGov.bd',
    'footer.about.description': 'Providing seamless access to government services for all citizens of Bangladesh.',
    'footer.services': 'Services',
    'footer.serviceDirectory': 'Service Directory',
    'footer.myDashboard': 'My Dashboard',
    'footer.myDocuments': 'My Documents',
    'footer.support': 'Support',
    'footer.helpCenter': 'Help Center',
    'footer.contactUs': 'Contact Us',
    'footer.faqs': 'FAQs',
    'footer.legal': 'Legal',
    'footer.privacyPolicy': 'Privacy Policy',
    'footer.termsOfService': 'Terms of Service',
    'footer.accessibility': 'Accessibility',
    'footer.copyright': '© 2026 eGov.bd - Government of Bangladesh. All rights reserved.',

    // Services Page
    'services.title': 'Service Directory',
    'services.description': 'Browse all government services by category',
    'services.backToHome': 'Back to Home',
    'services.search.placeholder': 'Search services by name or keyword...',
    'services.health': 'Health',
    'services.education': 'Education',
    'services.finance': 'Finance & Tax',
    'services.land': 'Land & Property',
    'services.social': 'Social Welfare',
    'services.commerce': 'Commerce',
    'services.accessService': 'Access Service',
    'services.noResults': 'No services found matching your search.',
    'services.azIndex': 'A-Z Service Index',

    // Dashboard Page
    'dashboard.title': 'My Dashboard',
    'dashboard.welcome': 'Welcome back, Ahmed Hassan',
    'dashboard.greeting': 'Hello, Ahmed Hassan!',
    'dashboard.greetingDescription': "Here's what you need to know today",
    'dashboard.activeApplications': 'Active Applications',
    'dashboard.documentsStored': 'Documents Stored',
    'dashboard.upcomingDates': 'Upcoming Dates',
    'dashboard.notifications': 'Notifications',
    'dashboard.myApplications': 'My Applications',
    'dashboard.myDocuments': 'My Documents',
    'dashboard.importantDates': 'Important Dates',
    'dashboard.uploadNewDocument': 'Upload New Document',
    'dashboard.download': 'Download',
    'dashboard.daysLeft': 'days left',
  },
  bn: {
    // Header
    'header.title': 'ই-গভ.বিডি',
    'header.subtitle': 'সরকারি সেবা পোর্টাল',
    'header.notifications': 'বিজ্ঞপ্তি',
    'header.profile': 'প্রোফাইল',
    'header.language': 'ভাষা',

    // Home Page
    'home.hero.title': 'সহজেই সরকারি সেবা খুঁজুন',
    'home.hero.description': 'এক জায়গায় সমস্ত সরকারি সেবা অ্যাক্সেস করুন। জন্ম নিবন্ধন থেকে ব্যবসায়িক লাইসেন্স পর্যন্ত।',
    'home.search.placeholder': 'সেবা, ডকুমেন্ট বা জীবন ইভেন্ট খুঁজুন...',
    
    'home.quickAccess': 'দ্রুত অ্যাক্সেস',
    'home.quickAccess.nationalId': 'জাতীয় পরিচয়পত্র',
    'home.quickAccess.passport': 'পাসপোর্ট সেবা',
    'home.quickAccess.tax': 'ট্যাক্স ফাইলিং',
    'home.quickAccess.utility': 'ইউটিলিটি বিল',

    'home.lifeEvents': 'জীবন ইভেন্ট',
    'home.lifeEvents.description': 'আপনার জীবনের পরিস্থিতির সাথে প্রাসঙ্গিক সেবা খুঁজুন',
    'home.viewAllServices': 'সমস্ত সেবা দেখুন',

    'home.family': 'পরিবার শুরু করা',
    'home.family.description': 'জন্ম নিবন্ধন, শিশু সুবিধা, স্বাস্থ্যসেবা',
    'home.family.service1': 'জন্ম নিবন্ধন',
    'home.family.service2': 'শিশু সুবিধা',
    'home.family.service3': 'স্বাস্থ্যসেবা',
    'home.family.service4': 'প্যারেন্টাল লিভ',

    'home.education': 'শিক্ষা',
    'home.education.description': 'স্কুল ভর্তি, বৃত্তি, সার্টিফিকেট',
    'home.education.service1': 'স্কুল ভর্তি',
    'home.education.service2': 'বৃত্তি',
    'home.education.service3': 'শিক্ষাগত সার্টিফিকেট',
    'home.education.service4': 'দক্ষতা প্রশিক্ষণ',

    'home.employment': 'কর্মসংস্থান',
    'home.employment.description': 'চাকরি অনুসন্ধান, বেকারত্ব সুবিধা, প্রশিক্ষণ',
    'home.employment.service1': 'চাকরি অনুসন্ধান পোর্টাল',
    'home.employment.service2': 'বেকারত্ব সুবিধা',
    'home.employment.service3': 'দক্ষতা প্রশিক্ষণ',
    'home.employment.service4': 'কর্ম পারমিট',

    'home.housing': 'আবাসন',
    'home.housing.description': 'সম্পত্তি নিবন্ধন, ইউটিলিটি সংযোগ',
    'home.housing.service1': 'সম্পত্তি নিবন্ধন',
    'home.housing.service2': 'ইউটিলিটি সংযোগ',
    'home.housing.service3': 'আবাসন ঋণ',
    'home.housing.service4': 'পারমিট',

    'home.business': 'ব্যবসা',
    'home.business.description': 'ব্যবসা নিবন্ধন, লাইসেন্স, ট্যাক্স',
    'home.business.service1': 'ব্যবসা নিবন্ধন',
    'home.business.service2': 'লাইসেন্স ও পারমিট',
    'home.business.service3': 'ট্যাক্স নিবন্ধন',
    'home.business.service4': 'সম্মতি',

    'home.retirement': 'অবসর',
    'home.retirement.description': 'পেনশন, বয়স্ক যত্ন, সামাজিক নিরাপত্তা',
    'home.retirement.service1': 'পেনশন সেবা',
    'home.retirement.service2': 'বয়স্ক যত্ন',
    'home.retirement.service3': 'সামাজিক নিরাপত্তা',
    'home.retirement.service4': 'স্বাস্থ্যসেবা',

    'home.announcements': 'সর্বশেষ ঘোষণা',
    'home.announcement1.title': 'নতুন ডিজিটাল আইডি সিস্টেম চালু হয়েছে',
    'home.announcement1.date': '৫ মার্চ, ২০২৬',
    'home.announcement1.description': 'নিরবচ্ছিন্ন সরকারি সেবা অ্যাক্সেসের জন্য নতুন ই-গভ.বিডি ডিজিটাল আইডি চালু করা হয়েছে।',

    'home.announcement2.title': 'ট্যাক্স ফাইলিং সময়সীমা বর্ধিত',
    'home.announcement2.date': '১ মার্চ, ২০২৬',
    'home.announcement2.description': 'ট্যাক্স ফাইলিং সময়সীমা ৩১ মার্চ, ২০২৬ পর্যন্ত বর্ধিত করা হয়েছে।',

    'home.announcement3.title': 'অনলাইন পাসপোর্ট আবেদন এখন উপলব্ধ',
    'home.announcement3.date': '২৮ ফেব্রুয়ারি, ২০২৬',
    'home.announcement3.description': 'অফিসে না গিয়ে অনলাইনে পাসপোর্টের জন্য আবেদন করুন।',

    'home.cta.title': 'ই-গভ.বিডিতে নতুন?',
    'home.cta.description': 'আপনার অ্যাকাউন্ট তৈরি করুন ব্যক্তিগত সেবা অ্যাক্সেস এবং আপনার আবেদন ট্র্যাক করতে।',
    'home.cta.createAccount': 'অ্যাকাউন্ট তৈরি করুন',
    'home.cta.learnMore': 'আরও জানুন',

    // Footer
    'footer.about': 'ই-গভ.বিডি সম্পর্কে',
    'footer.about.description': 'বাংলাদেশের সমস্ত নাগরিকদের জন্য নিরবচ্ছিন্ন সরকারি সেবা অ্যাক্সেস প্রদান করা হচ্ছে।',
    'footer.services': 'সেবা',
    'footer.serviceDirectory': 'সেবা ডিরেক্টরি',
    'footer.myDashboard': 'আমার ড্যাশবোর্ড',
    'footer.myDocuments': 'আমার ডকুমেন্ট',
    'footer.support': 'সহায়তা',
    'footer.helpCenter': 'সাহায্য কেন্দ্র',
    'footer.contactUs': 'আমাদের সাথে যোগাযোগ করুন',
    'footer.faqs': 'প্রায়শ জিজ্ঞাসিত প্রশ্ন',
    'footer.legal': 'আইনি',
    'footer.privacyPolicy': 'গোপনীয়তা নীতি',
    'footer.termsOfService': 'সেবার শর্তাবলী',
    'footer.accessibility': 'অ্যাক্সেসিবিলিটি',
    'footer.copyright': '© ২০২৬ ই-গভ.বিডি - বাংলাদেশ সরকার। সর্বাধিকার সংরক্ষিত।',

    // Services Page
    'services.title': 'সেবা ডিরেক্টরি',
    'services.description': 'ক্যাটাগরি অনুযায়ী সমস্ত সরকারি সেবা ব্রাউজ করুন',
    'services.backToHome': 'হোমে ফিরুন',
    'services.search.placeholder': 'নাম বা কীওয়ার্ড অনুযায়ী সেবা খুঁজুন...',
    'services.health': 'স্বাস্থ্য',
    'services.education': 'শিক্ষা',
    'services.finance': 'অর্থ ও ট্যাক্স',
    'services.land': 'ভূমি ও সম্পত্তি',
    'services.social': 'সামাজিক কল্যাণ',
    'services.commerce': 'বাণিজ্য',
    'services.accessService': 'সেবা অ্যাক্সেস করুন',
    'services.noResults': 'আপনার অনুসন্ধানের সাথে মেলে এমন কোনো সেবা পাওয়া যায়নি।',
    'services.azIndex': 'ক-ষ সেবা সূচী',

    // Dashboard Page
    'dashboard.title': 'আমার ড্যাশবোর্ড',
    'dashboard.welcome': 'আবার স্বাগতম, আহমেদ হাসান',
    'dashboard.greeting': 'হ্যালো, আহমেদ হাসান!',
    'dashboard.greetingDescription': 'আজ আপনার জন্য কী গুরুত্বপূর্ণ তা জানুন',
    'dashboard.activeApplications': 'সক্রিয় আবেদন',
    'dashboard.documentsStored': 'সংরক্ষিত ডকুমেন্ট',
    'dashboard.upcomingDates': 'আসন্ন তারিখ',
    'dashboard.notifications': 'বিজ্ঞপ্তি',
    'dashboard.myApplications': 'আমার আবেদন',
    'dashboard.myDocuments': 'আমার ডকুমেন্ট',
    'dashboard.importantDates': 'গুরুত্বপূর্ণ তারিখ',
    'dashboard.uploadNewDocument': 'নতুন ডকুমেন্ট আপলোড করুন',
    'dashboard.download': 'ডাউনলোড',
    'dashboard.daysLeft': 'দিন বাকি',
  }
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'bn' : 'en');
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['en']] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}
