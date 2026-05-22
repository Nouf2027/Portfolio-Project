import React from "react";
import { FaInstagram, FaSnapchat, FaTwitter } from "react-icons/fa";

const Footer = () => {
  return (
    <footer style={styles.footer}>
      <div style={styles.container}>

        <div>
          <h3 style={styles.title}>Jeel</h3>

          <p style={styles.text}>
            A smart platform for discovering children’s learning and activity centers.
          </p>
        </div>

        <div>
          <h3 style={styles.title}>Quick Links</h3>

          <ul style={styles.list}>
            <li>
              <a href="/home" style={styles.link}>
                Home
              </a>
            </li>

            <li>
              <a href="/search" style={styles.link}>
                Search
              </a>
            </li>

            <li>
              <a href="/privacy" style={styles.link}>
                Privacy Policy
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 style={styles.title}>Contact Us</h3>

          <ul style={styles.list}>
            <li>+966 50 123 4567</li>

            <li>
              <a href="mailto:info@jeel.com" style={styles.link}>
                info@jeel.com
              </a>
            </li>

            <li>Riyadh, Saudi Arabia</li>
          </ul>
        </div>

        <div>
          <h3 style={styles.title}>Follow Us</h3>

          <div style={styles.socials}>

            <a
              href="https://www.instagram.com"
              target="_blank"
              rel="noreferrer"
              style={styles.iconLink}
            >
              <FaInstagram />
            </a>

            <a
              href="https://www.snapchat.com"
              target="_blank"
              rel="noreferrer"
              style={styles.iconLink}
            >
              <FaSnapchat />
            </a>

            <a
              href="https://twitter.com"
              target="_blank"
              rel="noreferrer"
              style={styles.iconLink}
            >
              <FaTwitter />
            </a>

          </div>
        </div>

      </div>

      <div style={styles.bottom}>
        © 2025 Jeel. All rights reserved.
      </div>
    </footer>
  );
};

const styles = {
  footer: {
    backgroundColor: "rgba(255,255,255,0.7)",
    backdropFilter: "blur(10px)",
    marginTop: "20px",
    padding: "20px 25px 10px",
    borderTop: "1px solid #d6e6f5",
  },

  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "20px",
  },

  title: {
    marginBottom: "10px",
    fontSize: "16px",
    color: "#3b5b7a",
    fontWeight: "500",
  },

  text: {
    color: "#64748b",
    lineHeight: "1.6",
    fontWeight: "300",
    fontSize: "13px",
  },

  list: {
    listStyle: "none",
    padding: 0,
    lineHeight: "1.8",
    color: "#64748b",
    fontWeight: "300",
    fontSize: "13px",
  },

  socials: {
    display: "flex",
    gap: "14px",
    fontSize: "20px",
    marginTop: "8px",
  },

  iconLink: {
    color: "#3b5b7a",
    textDecoration: "none",
    transition: "0.3s ease",
  },

  link: {
    textDecoration: "none",
    color: "#64748b",
    transition: "0.3s ease",
  },

  bottom: {
    borderTop: "1px solid #d6e6f5",
    marginTop: "15px",
    paddingTop: "10px",
    textAlign: "center",
    color: "#94a3b8",
    fontSize: "11px",
    fontWeight: "300",
  },
};

export default Footer;