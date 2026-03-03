import { useEffect } from "react";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useLanguage } from "@/lib/language-context";
import { useSeoMeta } from "@/lib/language-context";
import { Building2, ShoppingBag, Truck, BarChart3, CheckCircle, ArrowLeft, Search, Star, Zap, Shield } from "lucide-react";

export default function Landing() {
  const { language } = useLanguage();
  const isArabic = language === "ar";

  // SEO Meta Tags
  useSeoMeta(
    isArabic 
      ? "MarketZone - منصة تسوق伊拉克ية | Iraq Online Marketplace"
      : "MarketZone - Iraq Online Marketplace | Multi-Vendor E-commerce",
    isArabic
      ? "MarketZone - أكبر منصة تسوق إلكترونية في العراق. سوق متعدد البائعين يربط المشترين مع أفضل المتاجر. تسوق إلكتروني، توصيل سريع، أنشئ متجرك الرقمي!"
      : "MarketZone - Iraq's largest online marketplace. Multi-vendor platform connecting buyers with the best stores. Fast delivery, easy setup for sellers."
  );

  const t = {
    ar: {
      heroTitle: "MarketZone",
      heroSubtitle: "منصة تسوق伊拉克ية",
      heroDesc: "أضخم سوق إلكتروني متعدد البائعين في العراق. اكتشف مئات المتاجر، تسوق منتجات متنوعة، وأنشئ متجرك الرقمي بسهولة.",
      cta1: "ابدأ الآن",
      cta2: "تسجيل الدخول",
      howItWorks: "كيف يعمل المنصة؟",
      step1Title: "أنشئ حسابك",
      step1Desc: "سجل في المنصة واختر دورك كعميل أو بائع أو سائق",
      step2Title: "استكشف وبيع",
      step2Desc: "تصفح المتاجر أو أنشئ متجرك وابدأ البيع فوراً",
      step3Title: "وصّل واستمتع",
      step3Desc: "توصيل سريع مع متابعة حالة الطلب في الوقت الفعلي",
      features: "مميزات المنصة",
      customers: "للعملاء",
      customersDesc: "تصفح مئات المتاجر الموثوقة، واشترِ المنتجات، وتتبع الطلبات في الوقت الفعلي.",
      sellers: "للبائعين",
      sellersDesc: "أنشئ واجهة متجرك الرقمي فوراً. أدر المخزون واستلم الطلبات بسلاسة.",
      drivers: "للسائقين",
      driversDesc: "الوصول إلى مهام التوصيل المحلية، وتحسين المسارات، وكسب المال حسب جدولك.",
      admin: "لإدارة المنصة",
      adminDesc: "رقابة كاملة مع تحليلات عميقة، وموافقات البائعين، وإدارة النظام البيئي.",
      stats: "إحصائيات المنصة",
      stores: "متجر",
      products: "منتج",
      orders: "طلب",
      delivery: "توصيل",
      whyChoose: "لماذا تختار MarketZone؟",
      fastDelivery: "توصيل سريع",
      fastDeliveryDesc: "نقدم خدمة توصيل سريعة لجميع أنحاء العراق",
      securePayment: "دفع آمن",
      securePaymentDesc: "طرق دفع متعددة وآمنة لتناسب جميع الاحتياجات",
      support: "دعم 24/7",
      supportDesc: "فريق دعم متواصل لمساعدتك في أي وقت",
      quality: "جودة مضمونة",
      qualityDesc: "نخبة البائعين المعتمدين لضمان أفضل جودة",
      ctaTitle: "ابدأ رحلتك التجارية اليوم",
      ctaDesc: "انضم إلى آلاف البائعين والعملاء على منصة MarketZone",
      ctaButton: "سجل مجاناً الآن",
      footer: "جميع الحقوق محفوظة",
    },
    en: {
      heroTitle: "MarketZone",
      heroSubtitle: "Iraq Online Marketplace",
      heroDesc: "The largest multi-vendor e-commerce platform in Iraq. Discover hundreds of stores, shop diverse products, and create your digital store easily.",
      cta1: "Get Started",
      cta2: "Sign In",
      howItWorks: "How It Works",
      step1Title: "Create Account",
      step1Desc: "Register on the platform and choose your role as customer, seller, or driver",
      step2Title: "Explore & Sell",
      step2Desc: "Browse stores or create your own and start selling instantly",
      step3Title: "Deliver & Enjoy",
      step3Desc: "Fast delivery with real-time order tracking",
      features: "Platform Features",
      customers: "For Customers",
      customersDesc: "Browse hundreds of trusted stores, purchase products, and track orders in real-time.",
      sellers: "For Sellers",
      sellersDesc: "Create your digital store instantly. Manage inventory and receive orders seamlessly.",
      drivers: "For Drivers",
      driversDesc: "Access local delivery tasks, optimize routes, and earn on your schedule.",
      admin: "Platform Management",
      adminDesc: "Complete oversight with deep analytics, seller approvals, and ecosystem management.",
      stats: "Platform Statistics",
      stores: "Stores",
      products: "Products",
      orders: "Orders",
      delivery: "Delivery",
      whyChoose: "Why Choose MarketZone?",
      fastDelivery: "Fast Delivery",
      fastDeliveryDesc: "We provide fast delivery services across Iraq",
      securePayment: "Secure Payment",
      securePaymentDesc: "Multiple secure payment methods to suit all needs",
      support: "24/7 Support",
      supportDesc: "Our support team is available to help you anytime",
      quality: "Guaranteed Quality",
      qualityDesc: "Verified sellers ensuring the best quality",
      ctaTitle: "Start Your Business Journey Today",
      ctaDesc: "Join thousands of sellers and customers on MarketZone",
      ctaButton: "Register Free Now",
      footer: "All rights reserved",
    }
  };

  const tr = t[language];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-16 sm:py-24 text-center max-w-4xl mx-auto">
        <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary/10 text-primary mb-6">
          {tr.heroSubtitle}
        </div>
        
        {/* H1 - Main Heading for SEO */}
        <h1 className="text-4xl sm:text-6xl font-display font-extrabold tracking-tight mb-6">
          {tr.heroTitle} <br />
          <span className="gradient-text">{tr.heroSubtitle}</span>
        </h1>
        
        <p className="text-xl text-muted-foreground mb-10 max-w-2xl leading-relaxed mx-auto">
          {tr.heroDesc}
        </p>
        
        <div className="flex flex-wrap gap-4 justify-center">
          <Button size="lg" className="h-12 px-8 text-base hover-elevate" asChild>
            <Link href="/auth">{tr.cta1}</Link>
          </Button>
          <Button size="lg" variant="outline" className="h-12 px-8 text-base hover-elevate" asChild>
            <Link href="/auth">{tr.cta2}</Link>
          </Button>
        </div>
      </section>

      {/* How it works section */}
      <section className="mb-16" aria-labelledby="how-it-works-heading">
        <h2 id="how-it-works-heading" className="text-2xl font-display font-bold text-center mb-8">{tr.howItWorks}</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="glass-card p-6 rounded-2xl text-center" dir={isArabic ? "rtl" : "ltr"}>
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-primary">1</span>
            </div>
            <h3 className="font-bold text-lg mb-2">{tr.step1Title}</h3>
            <p className="text-muted-foreground text-sm">{tr.step1Desc}</p>
          </div>
          
          <div className="glass-card p-6 rounded-2xl text-center" dir={isArabic ? "rtl" : "ltr"}>
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-primary">2</span>
            </div>
            <h3 className="font-bold text-lg mb-2">{tr.step2Title}</h3>
            <p className="text-muted-foreground text-sm">{tr.step2Desc}</p>
          </div>
          
          <div className="glass-card p-6 rounded-2xl text-center" dir={isArabic ? "rtl" : "ltr"}>
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-primary">3</span>
            </div>
            <h3 className="font-bold text-lg mb-2">{tr.step3Title}</h3>
            <p className="text-muted-foreground text-sm">{tr.step3Desc}</p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="mt-16" aria-labelledby="features-heading">
        <h2 id="features-heading" className="text-2xl font-display font-bold text-center mb-8">{tr.features}</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: <ShoppingBag className="w-6 h-6 text-primary" />, title: tr.customers, desc: tr.customersDesc },
            { icon: <Building2 className="w-6 h-6 text-primary" />, title: tr.sellers, desc: tr.sellersDesc },
            { icon: <Truck className="w-6 h-6 text-primary" />, title: tr.drivers, desc: tr.driversDesc },
            { icon: <BarChart3 className="w-6 h-6 text-primary" />, title: tr.admin, desc: tr.adminDesc },
          ].map((f, i) => (
            <div key={i} className="glass-card p-6 rounded-2xl hover-elevate group" dir={isArabic ? "rtl" : "ltr"}>
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                {f.icon}
              </div>
              <h3 className="font-bold text-lg mb-2">{f.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="mt-16" aria-labelledby="why-choose-heading">
        <h2 id="why-choose-heading" className="text-2xl font-display font-bold text-center mb-8">{tr.whyChoose}</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
          {[
            { icon: <Zap className="w-6 h-6 text-primary" />, title: tr.fastDelivery, desc: tr.fastDeliveryDesc },
            { icon: <Shield className="w-6 h-6 text-primary" />, title: tr.securePayment, desc: tr.securePaymentDesc },
            { icon: <Star className="w-6 h-6 text-primary" />, title: tr.support, desc: tr.supportDesc },
            { icon: <CheckCircle className="w-6 h-6 text-primary" />, title: tr.quality, desc: tr.qualityDesc },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-4 p-4" dir={isArabic ? "rtl" : "ltr"}>
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                {item.icon}
              </div>
              <div>
                <h3 className="font-bold text-sm mb-1">{item.title}</h3>
                <p className="text-muted-foreground text-xs">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="mt-16 py-12 bg-primary/5 rounded-2xl" aria-labelledby="cta-heading">
        <div className="text-center max-w-2xl mx-auto px-4">
          <h2 id="cta-heading" className="text-2xl font-display font-bold mb-4">{tr.ctaTitle}</h2>
          <p className="text-muted-foreground mb-6">{tr.ctaDesc}</p>
          <Button size="lg" className="h-12 px-8 text-base hover-elevate" asChild>
            <Link href="/register">{tr.ctaButton}</Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
}

