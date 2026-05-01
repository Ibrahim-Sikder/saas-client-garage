import { Box } from "@mui/material";
import {
  People,
  DirectionsCar,
  TrendingUp,
  Shield,
  Assignment,
  RequestQuote,
  Description,
  Payment,
  Inventory,
  AccountBalance,
  PersonAdd,
  Analytics,
} from "@mui/icons-material";

import { Navigation } from "../Landingpage/Navigation";
import { HeroSection } from "../Landingpage/HeroSection";
import { ClientLogos } from "../Landingpage/ClientLogo";
import { StatsSection } from "../Landingpage/StatSection";
import { FooterSection } from "../Landingpage/FooterSection";
import FinalCTASection from "../Landingpage/FinalCTASection";
import ContactSection from "../Landingpage/ContactSection";
import ConsultancySection from "../Landingpage/ConsultancySection";
import TestimonialsSection from "../Landingpage/TestimonialsSection";
import PricingSection from "../Landingpage/PricingSection";
import FeaturesSection from "../Landingpage/FeaturesSection";
import WorkflowSection from "../Landingpage/WorkflowSection";
import { useLanguage } from "../../providers/LanguageProvider";

export default function GarageLandingPage() {
  const { language, setLanguage } = useLanguage();

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const features = [
    {
      title: language === "ENG" ? "Customer Management" : "গ্রাহক ব্যবস্থাপনা",
      description:
        language === "ENG"
          ? "Complete 360° customer lifecycle management with AI-powered insights and personalized experiences."
          : "এআই-চালিত অন্তর্দৃষ্টি এবং ব্যক্তিগতকৃত অভিজ্ঞতার সাথে সম্পূর্ণ ৩৬০° গ্রাহক লাইফসাইকেল ব্যবস্থাপনা।",
      icon: <People sx={{ fontSize: 32 }} />,
      gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      items:
        language === "ENG"
          ? [
              "🎯 Complete Customer Profiles",
              "📱 Mobile Customer App",
              "💬 SMS & Email Automation",
              "🏆 Loyalty Program Management",
              "📊 Customer Analytics Dashboard",
            ]
          : [
              "🎯 সম্পূর্ণ গ্রাহক প্রোফাইল",
              "📱 মোবাইল গ্রাহক অ্যাপ",
              "💬 এসএমএস ও ইমেল অটোমেশন",
              "🏆 লয়্যালটি প্রোগ্রাম ব্যবস্থাপনা",
              "📊 গ্রাহক বিশ্লেষণ ড্যাশবোর্ড",
            ],
    },
    {
      title: language === "ENG" ? "Digital Job Cards" : "ডিজিটাল জব কার্ড",
      description:
        language === "ENG"
          ? "Revolutionary digital job card system with photo documentation, real-time updates, and progress tracking."
          : "ছবি ডকুমেন্টেশন, রিয়েল-টাইম আপডেট এবং প্রগতি ট্র্যাকিং সহ বিপ্লবী ডিজিটাল জব কার্ড সিস্টেম।",
      icon: <Assignment sx={{ fontSize: 32 }} />,
      gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
      items:
        language === "ENG"
          ? [
              "📸 Photo Documentation",
              "⏱️ Real-time Progress Tracking",
              "🔧 Digital Checklists",
              "👨‍🔧 Technician Assignment",
              "📋 Quality Control",
            ]
          : [
              "📸 ছবি ডকুমেন্টেশন",
              "⏱️ রিয়েল-টাইম প্রগতি ট্র্যাকিং",
              "🔧 ডিজিটাল চেকলিস্ট",
              "👨‍🔧 টেকনিশিয়ান নিয়োগ",
              "📋 মান নিয়ন্ত্রণ",
            ],
    },
    {
      title: language === "ENG" ? "Smart Quotations" : "স্মার্ট কোটেশন",
      description:
        language === "ENG"
          ? "AI-powered quotation system with dynamic pricing, parts integration, and instant approvals."
          : "ডায়নামিক প্রাইসিং, পার্টস ইন্টিগ্রেশন এবং তাৎক্ষণিক অনুমোদন সহ এআই-চালিত কোটেশন সিস্টেম।",
      icon: <RequestQuote sx={{ fontSize: 32 }} />,
      gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
      items:
        language === "ENG"
          ? [
              "🤖 AI-Powered Pricing",
              "⚡ Instant Quote Generation",
              "📧 Email & SMS Delivery",
              "✅ Digital Approvals",
              "🔄 Version Control",
            ]
          : [
              "🤖 এআই-চালিত মূল্য নির্ধারণ",
              "⚡ তাৎক্ষণিক কোট জেনারেশন",
              "📧 ইমেল ও এসএমএস ডেলিভারি",
              "✅ ডিজিটাল অনুমোদন",
              "🔄 সংস্করণ নিয়ন্ত্রণ",
            ],
    },
    {
      title:
        language === "ENG" ? "Professional Invoicing" : "পেশাদার ইনভয়েসিং",
      description:
        language === "ENG"
          ? "Enterprise-grade invoicing with automated tax calculations, multiple currencies, and payment tracking."
          : "স্বয়ংক্রিয় ট্যাক্স ক্যালকুলেশন, একাধিক মুদ্রা এবং পেমেন্ট ট্র্যাকিং সহ এন্টারপ্রাইজ-গ্রেড ইনভয়েসিং।",
      icon: <Description sx={{ fontSize: 32 }} />,
      gradient: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
      items:
        language === "ENG"
          ? [
              "💎 Professional Templates",
              "🧮 Auto Tax Calculations",
              "💱 Multi-Currency Support",
              "📊 Payment Tracking",
              "📄 PDF Generation",
            ]
          : [
              "💎 পেশাদার টেমপ্লেট",
              "🧮 স্বয়ংক্রিয় ট্যাক্স ক্যালকুলেশন",
              "💱 একাধিক মুদ্রা সমর্থন",
              "📊 পেমেন্ট ট্র্যাকিং",
              "📄 পিডিএফ জেনারেশন",
            ],
    },
    {
      title: language === "ENG" ? "Payment Gateway" : "পেমেন্ট গেটওয়ে",
      description:
        language === "ENG"
          ? "Secure payment processing with multiple payment methods, installments, and automated receipts."
          : "একাধিক পেমেন্ট পদ্ধতি, কিস্তি এবং স্বয়ংক্রিয় রসিদ সহ নিরাপদ পেমেন্ট প্রসেসিং।",
      icon: <Payment sx={{ fontSize: 32 }} />,
      gradient: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
      items:
        language === "ENG"
          ? [
              "💳 Multiple Payment Methods",
              "🔒 Secure Processing",
              "📱 Mobile Payments",
              "💰 Installment Plans",
              "🧾 Auto Receipts",
            ]
          : [
              "💳 একাধিক পেমেন্ট পদ্ধতি",
              "🔒 নিরাপদ প্রসেসিং",
              "📱 মোবাইল পেমেন্ট",
              "💰 কিস্তি পরিকল্পনা",
              "🧾 স্বয়ংক্রিয় রসিদ",
            ],
    },
    {
      title: language === "ENG" ? "Inventory Control" : "ইনভেন্টরি নিয়ন্ত্রণ",
      description:
        language === "ENG"
          ? "Smart inventory management with predictive analytics, auto-reordering, and supplier integration."
          : "প্রেডিকটিভ অ্যানালিটিক্স, স্বয়ংক্রিয় পুনরায় অর্ডার এবং সরবরাহকারী ইন্টিগ্রেশন সহ স্মার্ট ইনভেন্টরি ব্যবস্থাপনা।",
      icon: <Inventory sx={{ fontSize: 32 }} />,
      gradient: "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)",
      items:
        language === "ENG"
          ? [
              "📦 Real-time Stock Tracking",
              "🔄 Auto Reorder Points",
              "🏪 Supplier Management",
              "📈 Demand Forecasting",
              "💰 Cost Optimization",
            ]
          : [
              "📦 রিয়েল-টাইম স্টক ট্র্যাকিং",
              "🔄 স্বয়ংক্রিয় রিঅর্ডার পয়েন্ট",
              "🏪 সরবরাহকারী ব্যবস্থাপনা",
              "📈 চাহিদা পূর্বাভাস",
              "💰 খরচ অপ্টিমাইজেশন",
            ],
    },
    {
      title: language === "ENG" ? "Financial Management" : "আর্থিক ব্যবস্থাপনা",
      description:
        language === "ENG"
          ? "Complete accounting solution with P&L reports, cash flow management, and business intelligence."
          : "পিএন্ডএল রিপোর্ট, নগদ প্রবাহ ব্যবস্থাপনা এবং বিজনেস ইন্টেলিজেন্স সহ সম্পূর্ণ অ্যাকাউন্টিং সমাধান।",
      icon: <AccountBalance sx={{ fontSize: 32 }} />,
      gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      items:
        language === "ENG"
          ? [
              "📊 P&L Reports",
              "💰 Cash Flow Management",
              "📈 Business Analytics",
              "🧾 Expense Tracking",
              "📋 Tax Compliance",
            ]
          : [
              "📊 পিএন্ডএল রিপোর্ট",
              "💰 নগদ প্রবাহ ব্যবস্থাপনা",
              "📈 ব্যবসায়িক বিশ্লেষণ",
              "🧾 ব্যয় ট্র্যাকিং",
              "📋 ট্যাক্স কমপ্লায়েন্স",
            ],
    },
    {
      title: language === "ENG" ? "Business Analytics" : "ব্যবসায়িক বিশ্লেষণ",
      description:
        language === "ENG"
          ? "Advanced analytics and reporting with AI insights, performance metrics, and growth recommendations."
          : "এআই অন্তর্দৃষ্টি, কর্মক্ষমতা মেট্রিক্স এবং বৃদ্ধির সুপারিশ সহ উন্নত বিশ্লেষণ এবং রিপোর্টিং।",
      icon: <Analytics sx={{ fontSize: 32 }} />,
      gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
      items:
        language === "ENG"
          ? [
              "📊 Real-time Dashboards",
              "🤖 AI-Powered Insights",
              "📈 Performance Metrics",
              "🎯 Growth Recommendations",
              "📋 Custom Reports",
            ]
          : [
              "📊 রিয়েল-টাইম ড্যাশবোর্ড",
              "🤖 এআই-চালিত অন্তর্দৃষ্টি",
              "📈 কর্মক্ষমতা মেট্রিক্স",
              "🎯 বৃদ্ধির সুপারিশ",
              "📋 কাস্টম রিপোর্ট",
            ],
    },
  ];

  const workflowSteps = [
    {
      step: 1,
      title: language === "ENG" ? "Customer Registration" : "গ্রাহক নিবন্ধন",
      description:
        language === "ENG"
          ? "Easy customer onboarding with complete profile management and vehicle history tracking."
          : "সম্পূর্ণ প্রোফাইল ব্যবস্থাপনা এবং যানবাহন ইতিহাস ট্র্যাকিং সহ সহজ গ্রাহক অনবোর্ডিং।",
      icon: <PersonAdd sx={{ fontSize: 32 }} />,
    },
    {
      step: 2,
      title: language === "ENG" ? "Job Card Creation" : "জব কার্ড তৈরি",
      description:
        language === "ENG"
          ? "Digital job cards with photos, diagnostics, and real-time progress tracking."
          : "ছবি, ডায়াগনস্টিকস এবং রিয়েল-টাইম প্রগতি ট্র্যাকিং সহ ডিজিটাল জব কার্ড।",
      icon: <Assignment sx={{ fontSize: 32 }} />,
    },
    {
      step: 3,
      title: language === "ENG" ? "Smart Quotation" : "স্মার্ট কোটেশন",
      description:
        language === "ENG"
          ? "AI-powered quotations with parts pricing, labor costs, and approval workflows."
          : "পার্টস মূল্য, শ্রম খরচ এবং অনুমোদন ওয়ার্কফ্লো সহ এআই-চালিত কোটেশন।",
      icon: <RequestQuote sx={{ fontSize: 32 }} />,
    },
    {
      step: 4,
      title: language === "ENG" ? "Professional Invoice" : "পেশাদার ইনভয়েস",
      description:
        language === "ENG"
          ? "Automated invoicing with tax calculations, multiple payment options, and delivery."
          : "ট্যাক্স ক্যালকুলেশন, একাধিক পেমেন্ট অপশন এবং ডেলিভারি সহ স্বয়ংক্রিয় ইনভয়েসিং।",
      icon: <Description sx={{ fontSize: 32 }} />,
    },
    {
      step: 5,
      title:
        language === "ENG" ? "Professional Money Receipt" : "পেশাদার টাকা রসিদ",
      description:
        language === "ENG"
          ? "Automated invoicing with tax calculations, multiple payment options, and delivery."
          : "ট্যাক্স ক্যালকুলেশন, একাধিক পেমেন্ট অপশন এবং ডেলিভারি সহ স্বয়ংক্রিয় ইনভয়েসিং।",
      icon: <Description sx={{ fontSize: 32 }} />,
    },
    {
      step: 6,
      title: language === "ENG" ? "Payment Processing" : "পেমেন্ট প্রসেসিং",
      description:
        language === "ENG"
          ? "Secure payment gateway integration with multiple payment methods and receipts."
          : "একাধিক পেমেন্ট পদ্ধতি এবং রসিদ সহ নিরাপদ পেমেন্ট গেটওয়ে ইন্টিগ্রেশন।",
      icon: <Payment sx={{ fontSize: 32 }} />,
    },
    {
      step: 7,
      title:
        language === "ENG" ? "Inventory Management" : "ইনভেন্টরি ব্যবস্থাপনা",
      description:
        language === "ENG"
          ? "Real-time inventory tracking with auto-reordering and supplier management."
          : "স্বয়ংক্রিয় পুনরায় অর্ডার এবং সরবরাহকারী ব্যবস্থাপনা সহ রিয়েল-টাইম ইনভেন্টরি ট্র্যাকিং।",
      icon: <Inventory sx={{ fontSize: 32 }} />,
    },
    {
      step: 8,
      title:
        language === "ENG" ? "Account Management" : "অ্যাকাউন্ট ব্যবস্থাপনা",
      description:
        language === "ENG"
          ? "Complete financial management with P&L reports, cash flow, and business analytics."
          : "পিএন্ডএল রিপোর্ট, নগদ প্রবাহ এবং ব্যবসায়িক বিশ্লেষণ সহ সম্পূর্ণ আর্থিক ব্যবস্থাপনা।",
      icon: <AccountBalance sx={{ fontSize: 32 }} />,
    },
    {
      step: 9,
      title:
        language === "ENG" ? "Employee Management" : "কর্মচারী ব্যবস্থাপনা",
      description:
        language === "ENG"
          ? "Complete employee management with attendance tracking, payroll, and performance monitoring."
          : "উপস্থিতি ট্র্যাকিং, বেতন এবং কর্মক্ষমতা মনিটরিং সহ সম্পূর্ণ কর্মচারী ব্যবস্থাপনা।",
      icon: <AccountBalance sx={{ fontSize: 32 }} />,
    },
  ];

  const pricingPlans = [
    {
      name: language === "ENG" ? "Starter Pro" : "স্টার্টার প্রো",
      price: 79,
      originalPrice: 99,
      period: language === "ENG" ? "month" : "মাস",
      description:
        language === "ENG"
          ? "Perfect for small garages starting their digital journey"
          : "ছোট গ্যারেজের জন্য উপযুক্ত যারা তাদের ডিজিটাল যাত্রা শুরু করছে",
      features:
        language === "ENG"
          ? [
              "✨ Up to 5 users",
              "🚗 50 vehicles/month",
              "📋 Digital job cards",
              "💰 Basic invoicing",
              "📱 Mobile app access",
              "📞 Email support",
              "🔒 Standard security",
              "📊 Basic reports",
            ]
          : [
              "✨ ৫ জন ব্যবহারকারী পর্যন্ত",
              "🚗 ৫০টি গাড়ি/মাস",
              "📋 ডিজিটাল জব কার্ড",
              "💰 মৌলিক ইনভয়েসিং",
              "📱 মোবাইল অ্যাপ অ্যাক্সেস",
              "📞 ইমেল সমর্থন",
              "🔒 স্ট্যান্ডার্ড নিরাপত্তা",
              "📊 মৌলিক রিপোর্ট",
            ],
      popular: false,
      savings: language === "ENG" ? "Save $240/year" : "সাশ্রয় $২৪০/বছর",
    },
    {
      name: language === "ENG" ? "Professional Elite" : "প্রফেশনাল এলিট",
      price: 149,
      originalPrice: 199,
      period: language === "ENG" ? "month" : "মাস",
      description:
        language === "ENG"
          ? "Most popular choice for growing garage businesses"
          : "ক্রমবর্ধমান গ্যারেজ ব্যবসার জন্য সবচেয়ে জনপ্রিয় পছন্দ",
      features:
        language === "ENG"
          ? [
              "🏆 Unlimited users",
              "🚗 Unlimited vehicles",
              "🤖 AI-powered analytics",
              "💎 Advanced invoicing",
              "💳 Payment gateway",
              "📦 Inventory management",
              "⚡ 24/7 priority support",
              "🔌 API integrations",
              "📊 Advanced reports",
              "🎯 Customer portal",
            ]
          : [
              "🏆 সীমাহীন ব্যবহারকারী",
              "🚗 সীমাহীন গাড়ি",
              "🤖 এআই-চালিত বিশ্লেষণ",
              "💎 উন্নত ইনভয়েসিং",
              "💳 পেমেন্ট গেটওয়ে",
              "📦 ইনভেন্টরি ব্যবস্থাপনা",
              "⚡ ২৪/৭ অগ্রাধিকার সমর্থন",
              "🔌 এপিআই ইন্টিগ্রেশন",
              "📊 উন্নত রিপোর্ট",
              "🎯 গ্রাহক পোর্টাল",
            ],
      popular: true,
      savings: language === "ENG" ? "Save $600/year" : "সাশ্রয় $৬০০/বছর",
    },
    {
      name:
        language === "ENG" ? "Enterprise Platinum" : "এন্টারপ্রাইজ প্লাটিনাম",
      price: 299,
      originalPrice: 399,
      period: language === "ENG" ? "month" : "মাস",
      description:
        language === "ENG"
          ? "Complete solution for large garage operations"
          : "বড় গ্যারেজ অপারেশনের জন্য সম্পূর্ণ সমাধান",
      features:
        language === "ENG"
          ? [
              "🚀 Everything in Professional",
              "🌍 Multi-location support",
              "🔧 Custom integrations",
              "👨‍💼 Dedicated account manager",
              "🎨 White-label options",
              "📈 Advanced analytics suite",
              "🏅 Priority feature requests",
              "🔒 Enterprise security",
              "📋 Custom workflows",
              "🎓 Training & onboarding",
            ]
          : [
              "🚀 প্রফেশনালের সবকিছু",
              "🌍 একাধিক অবস্থান সমর্থন",
              "🔧 কাস্টম ইন্টিগ্রেশন",
              "👨‍💼 ডেডিকেটেড অ্যাকাউন্ট ম্যানেজার",
              "🎨 হোয়াইট-লেবেল অপশন",
              "📈 উন্নত বিশ্লেষণ স্যুট",
              "🏅 অগ্রাধিকার ফিচার অনুরোধ",
              "🔒 এন্টারপ্রাইজ নিরাপত্তা",
              "📋 কাস্টম ওয়ার্কফ্লো",
              "🎓 প্রশিক্ষণ ও অনবোর্ডিং",
            ],
      popular: false,
      savings: language === "ENG" ? "Save $1200/year" : "সাশ্রয় $১২০০/বছর",
    },
  ];

  const testimonials = [
    {
      name: "Alexander Rodriguez",
      role:
        language === "ENG"
          ? "CEO, Rodriguez Auto Empire"
          : "সিইও, রডরিগেজ অটো এম্পায়ার",
      company:
        language === "ENG" ? "Rodriguez Auto Group" : "রডরিগেজ অটো গ্রুপ",
      avatar: "/placeholder.svg?height=80&width=80",
      rating: 5,
      revenue: "+250%",
      content:
        language === "ENG"
          ? "Garage Master transformed our entire business operation. The workflow from customer to payment is seamless. Our revenue increased by 250% in just 6 months!"
          : "গ্যারেজ মাস্টার আমাদের সম্পূর্ণ ব্যবসায়িক অপারেশন রূপান্তরিত করেছে। গ্রাহক থেকে পেমেন্ট পর্যন্ত ওয়ার্কফ্লো নির্বিঘ্ন। আমাদের রাজস্ব মাত্র ৬ মাসে ২৫০% বেড়েছে!",
      badge: language === "ENG" ? "🏆 Top Performer" : "🏆 শীর্ষ পারফর্মার",
    },
    {
      name: "Dr. Sarah Chen",
      role:
        language === "ENG"
          ? "Director, Elite Motors Group"
          : "ডিরেক্টর, এলিট মোটরস গ্রুপ",
      company:
        language === "ENG" ? "Elite Motors Network" : "এলিট মোটরস নেটওয়ার্ক",
      avatar: "/placeholder.svg?height=80&width=80",
      rating: 5,
      revenue: "+180%",
      content:
        language === "ENG"
          ? "The AI-powered insights and automated workflow saved us 40 hours per week. The customer management system is absolutely game-changing for our business."
          : "এআই-চালিত অন্তর্দৃষ্টি এবং স্বয়ংক্রিয় ওয়ার্কফ্লো আমাদের সপ্তাহে ৪০ ঘন্টা বাঁচিয়েছে। গ্রাহক ব্যবস্থাপনা সিস্টেম আমাদের ব্যবসার জন্য একেবারে গেম-চেঞ্জিং।",
      badge: language === "ENG" ? "🚀 Innovation Leader" : "🚀 উদ্ভাবন নেতা",
    },
    {
      name: "Marcus Thompson",
      role:
        language === "ENG"
          ? "Founder, Thompson Auto Network"
          : "প্রতিষ্ঠাতা, থম্পসন অটো নেটওয়ার্ক",
      company: language === "ENG" ? "Thompson Auto Chain" : "থম্পসন অটো চেইন",
      avatar: "/placeholder.svg?height=80&width=80",
      rating: 5,
      revenue: "+320%",
      content:
        language === "ENG"
          ? "Managing 15 locations was a nightmare before Garage Master. Now everything is centralized, automated, and profitable. Best investment we ever made!"
          : "গ্যারেজ মাস্টারের আগে ১৫টি অবস্থান পরিচালনা করা দুঃস্বপ্ন ছিল। এখন সবকিছু কেন্দ্রীভূত, স্বয়ংক্রিয় এবং লাভজনক। সেরা বিনিয়োগ আমরা কখনও করেছি!",
      badge:
        language === "ENG"
          ? "⭐ Enterprise Champion"
          : "⭐ এন্টারপ্রাইজ চ্যাম্পিয়ন",
    },
    {
      name: "Jennifer Williams",
      role:
        language === "ENG"
          ? "Owner, Williams Auto Care"
          : "মালিক, উইলিয়ামস অটো কেয়ার",
      company:
        language === "ENG"
          ? "Williams Auto Services"
          : "উইলিয়ামস অটো সার্ভিসেস",
      avatar: "/placeholder.svg?height=80&width=80",
      rating: 5,
      revenue: "+195%",
      content:
        language === "ENG"
          ? "The complete workflow from job card to payment is incredible. Our customers love the transparency and we love the efficiency. Highly recommended!"
          : "জব কার্ড থেকে পেমেন্ট পর্যন্ত সম্পূর্ণ ওয়ার্কফ্লো অবিশ্বাস্য। আমাদের গ্রাহকরা স্বচ্ছতা পছন্দ করেন এবং আমরা দক্ষতা পছন্দ করি। অত্যন্ত সুপারিশ!",
      badge:
        language === "ENG" ? "💎 Premium User" : "💎 প্রিমিয়াম ব্যবহারকারী",
    },
  ];

  const stats = [
    {
      value: 2500,
      label: language === "ENG" ? "Happy Clients" : "সন্তুষ্ট ক্লায়েন্ট",
      suffix: "+",
      icon: <People />,
    },
    {
      value: 150000,
      label: language === "ENG" ? "Vehicles Managed" : "পরিচালিত যানবাহন",
      suffix: "+",
      icon: <DirectionsCar />,
    },
    {
      value: 99.99,
      label: language === "ENG" ? "Uptime Guarantee" : "আপটাইম গ্যারান্টি",
      suffix: "%",
      icon: <Shield />,
    },
    {
      value: 85,
      label: language === "ENG" ? "Average Growth" : "গড় বৃদ্ধি",
      suffix: "%",
      icon: <TrendingUp />,
    },
  ];

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #0f172a 0%, #581c87 50%, #0f172a 100%)",
        color: "white",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <Navigation
        scrollToSection={scrollToSection}
        language={language}
        setLanguage={setLanguage}
      />
      <HeroSection language={language} />
      <ClientLogos language={language} />
      <StatsSection stats={stats} language={language} />
      <WorkflowSection workflowSteps={workflowSteps} language={language} />
      <FeaturesSection features={features} language={language} />
      <PricingSection pricingPlans={pricingPlans} language={language} />
      <TestimonialsSection testimonials={testimonials} language={language} />
      <ConsultancySection language={language} />
      <ContactSection language={language} />
      <FinalCTASection language={language} />
      <FooterSection language={language} />
    </Box>
  );
}
