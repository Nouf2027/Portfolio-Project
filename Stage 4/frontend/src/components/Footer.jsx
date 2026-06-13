import React from "react";
import { FaInstagram, FaSnapchat, FaTwitter } from "react-icons/fa";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer style={styles.footer}>
      <img src="/children.jpg" alt="" style={styles.bgImg} />
      <div style={styles.overlay} />
      <div style={styles.content}>
        <div style={styles.brandRow}>
          <img src="/sprout.png" alt="جيل" style={styles.logoImg} />
          <span style={styles.brandName}>جيل</span>
        </div>
        <div style={styles.container}>
          <div>
            <p style={styles.text}>منصة ذكية لاكتشاف مراكز التعلم والأنشطة للأطفال.</p>
          </div>
          <div>
            <h3 style={styles.title}>روابط سريعة</h3>
            <ul style={styles.list}>
              <li><Link to="/home" style={styles.link}>الرئيسية</Link></li>
              <li><Link to="/privacy" style={styles.link}>سياسة الخصوصية</Link></li>
            </ul>
          </div>
          <div id="contact">
            <h3 style={styles.title}>تواصل معنا</h3>
            <ul style={styles.list}>
              <li>+966 50 123 4567</li>
              <li><a href="mailto:info@jeel.com" style={styles.link}>info@jeel.com</a></li>
              <li>الرياض، المملكة العربية السعودية</li>
            </ul>
          </div>
          <div>
            <h3 style={styles.title}>تابعنا</h3>
<div style={styles.socials}>
  <a
    href="https://www.instagram.com"
    target="_blank"
    rel="noreferrer"
    style={styles.iconLink}
    onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-3px) scale(1.1)")}
    onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0) scale(1)")}
  >
    <FaInstagram />
  </a>

  <a
    href="https://www.snapchat.com"
    target="_blank"
    rel="noreferrer"
    style={styles.iconLink}
    onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-3px) scale(1.1)")}
    onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0) scale(1)")}
  >
    <FaSnapchat />
  </a>

  <a
    href="https://twitter.com"
    target="_blank"
    rel="noreferrer"
    style={styles.iconLink}
    onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-3px) scale(1.1)")}
    onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0) scale(1)")}
  >
    <FaTwitter />
  </a>
</div>
          </div>
        </div>
        <div style={styles.bottom}>© 2026 جيل. جميع الحقوق محفوظة.</div>
      </div>
    </footer>
  );
};

const styles = {
  footer: { position: "relative", overflow: "hidden", direction: "rtl" },
  bgImg: { position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 60%" },
  overlay: { position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(27,58,107,0.92), rgba(86,194,230,0.85))" },
  content: { position: "relative", padding: "6px 20px 2px" },
  brandRow: { display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginBottom: 4 },
  logoImg: { width: 28, height: 28, objectFit: "contain", filter: "brightness(0) invert(1)" },
  brandName: { fontSize: 20, fontWeight: 900, color: "#fff", fontFamily: "'Cairo', 'Poppins', sans-serif" },
  container: { maxWidth: "1200px", margin: "0 auto 4px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "6px" },
  title: { marginBottom: "4px", fontSize: "15px", color: "#fff", fontWeight: "700" },
  text: { color: "rgba(255,255,255,0.8)", lineHeight: "1.3", fontSize: "12px", marginTop: 0 },
  list: { listStyle: "none", padding: 0, margin: 0, lineHeight: "1.4", color: "rgba(255,255,255,0.75)", fontSize: "12px" },
  socials: { display: "flex", gap: "10px", fontSize: "20px", marginTop: "4px" },
  iconLink: { color: "rgba(255,255,255,0.85)", textDecoration: "none", transition: "all 0.3s ease" },
  link: { textDecoration: "none", color: "rgba(255,255,255,0.75)" },
  bottom: { borderTop: "1px solid rgba(255,255,255,0.2)", marginTop: "4px", paddingTop: "4px", textAlign: "center", color: "rgba(255,255,255,0.6)", fontSize: "10px" },
};

export default Footer;
