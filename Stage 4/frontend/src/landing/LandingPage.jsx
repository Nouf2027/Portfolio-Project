import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  FaSearch, FaBookOpen, FaStar, FaShieldAlt,
  FaUpload, FaLock, FaArrowLeft
} from "react-icons/fa";

import "./LandingPage.css";

function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, inView];
}

function Hero() {
  const [loaded, setLoaded] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));
  useEffect(() => { setTimeout(() => setLoaded(true), 100); }, []);
  return (
    <section className="lp-hero">
      <img src="/children.jpg" alt="أطفال" className="lp-hero-img" />
      <div className="lp-hero-overlay" />
      <div className={`lp-hero-content ${loaded ? "lp-fade-in" : ""}`}>
        <div className="lp-hero-brand">
          <img src="/sprout.png" alt="جيل" className="lp-hero-logo" />
          <h1>جيل</h1>
        </div>
        <p className="lp-hero-sub">
          منصة إلكترونية تربط الأسر بالمراكز التعليمية والتثقيفية للأطفال في مكان واحد
        </p>
        <p className="lp-hero-tag">ابحث • اكتشف • تواصل</p>
        <div className="lp-hero-btns">
          <Link to={user ? "/home" : "/login"} className="lp-btn-primary">
            ابدأ الآن <FaArrowLeft />
          </Link>
          <Link to="/home" className="lp-btn-secondary">
            تصفح المراكز
          </Link>
        </div>
        {!user && (
          <p style={{ color: "rgba(255,255,255,0.7)", marginTop: 16, fontSize: 14 }}>
            ما عندك حساب؟{" "}
            <Link to="/register" style={{ color: "#56C2E6", fontWeight: 700 }}>
              سجّل الآن
            </Link>
          </p>
        )}
      </div>
      <div className="lp-scroll-hint">
        <span>اسكرول</span>
        <div className="lp-scroll-line" />
      </div>
    </section>
  );
}

function Stats() {
  const [ref, inView] = useInView();
  const stats = [
    { num: "٥٠٠+", label: "مركز تعليمي" },
    { num: "١٢٠٠٠+", label: "أسرة مسجلة" },
    { num: "٣٠٠+", label: "دورة متاحة" },
    { num: "٤.٩", label: "تقييم المستخدمين" },
  ];
  return (
    <section ref={ref} className="lp-stats">
      {stats.map((s, i) => (
        <div key={i} className={`lp-stat ${inView ? "lp-slide-up" : ""}`}
          style={{ transitionDelay: `${i * 0.1}s` }}>
          <div className="lp-stat-num">{s.num}</div>
          <div className="lp-stat-label">{s.label}</div>
        </div>
      ))}
    </section>
  );
}

function About() {
  const [ref, inView] = useInView();
  return (
    <section id="about" ref={ref} className="lp-about">
      <div className={`lp-about-inner ${inView ? "lp-slide-up" : ""}`}>
        <span className="lp-badge lp-badge-blue">عن المنصة</span>
        <h2>كل ما يحتاجه طفلك في مكان واحد</h2>
        <p>
          منصة جيل تهدف إلى تسهيل وصول أولياء الأمور إلى المراكز التعليمية
          والتثقيفية للأطفال. تمكّنك من استعراض المراكز، البحث حسب التخصص
          أو الفئة العمرية، والاطلاع على تقييمات حقيقية لمساعدتك في اختيار
          الأنسب لطفلك.
        </p>
      </div>
    </section>
  );
}

function FeatureCard({ icon, title, desc, delay, inView }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className={`lp-feature-card ${inView ? "lp-slide-up" : ""} ${hovered ? "lp-feature-hovered" : ""}`}
      style={{ transitionDelay: `${delay}s` }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="lp-feature-icon">{icon}</div>
      <h3>{title}</h3>
      <p>{desc}</p>
    </div>
  );
}

function Features() {
  const [ref, inView] = useInView();
  const features = [
    { icon: <FaSearch />, title: "البحث الذكي", desc: "ابحث عن المراكز حسب التخصص أو الفئة العمرية أو الموقع" },
    { icon: <FaBookOpen />, title: "استعراض الدورات", desc: "تصفح جميع الدورات والأنشطة المتاحة بتفاصيل كاملة" },
    { icon: <FaStar />, title: "تقييمات حقيقية", desc: "اقرأ تجارب أولياء الأمور واتخذ قرارك بثقة وأمان" },
    { icon: <FaShieldAlt />, title: "مراكز موثوقة", desc: "جميع المراكز تمر بعملية تحقق ومراجعة قبل النشر" },
    { icon: <FaUpload />, title: "رفع المستندات", desc: "تمكّن المراكز من رفع الصور والشهادات بسهولة" },
    { icon: <FaLock />, title: "تسجيل دخول آمن", desc: "نظام مصادقة يضمن حماية بياناتك وخصوصيتك الكاملة" },
  ];
  return (
    <section ref={ref} className="lp-features">
      <div className="lp-section-header">
        <span className="lp-badge lp-badge-orange">المميزات</span>
        <h2>لماذا تختار منصة جيل؟</h2>
      </div>
      <div className="lp-features-grid">
        {features.map((f, i) => (
          <FeatureCard key={i} {...f} delay={i * 0.08} inView={inView} />
        ))}
      </div>
    </section>
  );
}

function HowItWorks() {
  const [ref, inView] = useInView();
  const steps = [
    { num: "١", title: "سجّل حسابك", desc: "أنشئ حسابك كولي أمر أو مركز تعليمي في خطوات بسيطة" },
    { num: "٢", title: "ابحث واكتشف", desc: "استخدم خاصية البحث لإيجاد المركز المناسب لطفلك" },
    { num: "٣", title: "اقرأ وقيّم", desc: "اطلع على تقييمات الآخرين وشارك تجربتك" },
    { num: "٤", title: "تواصل وانضم", desc: "تواصل مع المركز وسجّل طفلك في الدورة المناسبة" },
  ];
  return (
    <section ref={ref} className="lp-how">
      <div className="lp-section-header lp-section-header-dark">
        <span className="lp-badge lp-badge-outline">كيف تعمل المنصة</span>
        <h2>أربع خطوات بسيطة</h2>
      </div>
      <div className="lp-steps-grid">
        {steps.map((s, i) => (
          <StepCard key={i} {...s} delay={i * 0.1} inView={inView} />
        ))}
      </div>
    </section>
  );
}

function StepCard({ num, title, desc, delay, inView }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className={`lp-step-card ${inView ? "lp-slide-up" : ""} ${hovered ? "lp-step-hovered" : ""}`}
      style={{ transitionDelay: `${delay}s` }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="lp-step-num">{num}</div>
      <h3>{title}</h3>
      <p>{desc}</p>
    </div>
  );
}

function QRSection() {
  const [ref, inView] = useInView();
  const siteUrl = "https://portfolio-project-1-2xla.onrender.com";
  return (
    <section ref={ref} className="lp-qr">
      <div className={`lp-qr-inner ${inView ? "lp-slide-up" : ""}`}>
        <span className="lp-badge lp-badge-blue">زيارة المنصة</span>
        <h2>امسح الكود للوصول مباشرة</h2>
        <div className="lp-qr-box">
          <div style={{
  width:160, height:160, background:"#fff",
  border:"2px solid #e2e8f0", borderRadius:12,
  display:"flex", alignItems:"center", justifyContent:"center",
  flexDirection:"column", gap:8, fontSize:12, color:"#64748b"
}}>
  <span style={{fontSize:32}}>📱</span>
  <span>امسح للزيارة</span>
</div>
        </div>
        <p>{siteUrl}</p>
      </div>
    </section>
  );
}

function CTA() {
  const [ref, inView] = useInView();
  const user = JSON.parse(localStorage.getItem("user"));
  return (
    <section ref={ref} className="lp-cta">
      <div className={`lp-cta-inner ${inView ? "lp-slide-up" : ""}`}>
        <div className="lp-cta-icon">
          <img src="/sprout.png" alt="جيل" style={{ width: 64, height: 64, objectFit: "contain" }} />
        </div>
        <h2>انضم إلى منصة جيل اليوم</h2>
        <p>ابدأ رحلة البحث عن المركز التعليمي المثالي لطفلك الآن</p>
        <Link to={user ? "/home" : "/login"} className="lp-btn-dark">
          ابدأ الآن <FaArrowLeft />
        </Link>
      </div>
    </section>
  );
}

export default function LandingPage() {
  return (
    <div className="lp-page" dir="rtl">
      <Hero />
      <Stats />
      <About />
      <Features />
      <HowItWorks />
      <QRSection />
      <CTA />
    </div>
  );
}