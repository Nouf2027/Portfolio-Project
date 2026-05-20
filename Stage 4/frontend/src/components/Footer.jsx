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
    backgroundColor: "#fffaf0",
    marginTop: "10px",
    padding: "15px 20px 5px",
    borderTop: "1px solid #fde68a",
  },

  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "15px",
  },

  title: {
    marginBottom: "8px",
    fontSize: "16px",
    color: "#f97316",
    fontWeight: "500",
  },

  text: {
    color: "#64748b",
    lineHeight: "1.5",
    fontWeight: "300",
    fontSize: "13px",
  },

  list: {
    listStyle: "none",
    padding: 0,
    lineHeight: "1.6",
    color: "#64748b",
    fontWeight: "300",
    fontSize: "13px",
  },

  socials: {
    display: "flex",
    gap: "14px",
    fontSize: "20px",
    marginTop: "5px",
  },

  iconLink: {
    color: "#f97316",
    textDecoration: "none",
  },

  link: {
    textDecoration: "none",
    color: "#64748b",
  },

  bottom: {
    borderTop: "1px solid #fde68a",
    marginTop: "10px",
    paddingTop: "5px",
    textAlign: "center",
    color: "#94a3b8",
    fontSize: "11px",
    fontWeight: "300",
  },
};

export default Footer;