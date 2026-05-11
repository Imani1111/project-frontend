import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-brand">
          <h2>MyStore</h2>
          <p>Bringing the best products to your doorstep</p>
        </div>

        <div className="footer-links">
          <div>
            <h4>Quick Links</h4>
            <ul>
              <li>
                <a href="/">Home</a>
              </li>
              <li>
                <a href="/signup">Signup</a>
              </li>
              <li>
                <a href="/signin">Signin</a>
              </li>
            </ul>
          </div>
          <div>
            <h4>Support</h4>
            <ul>
              <li>
                <a href="/payment">Payment</a>
              </li>
              <li>
                <a href="/admin-login">Admin Login</a>
              </li>
            </ul>
          </div>
          <div>
            <h4>Follow Us</h4>
            <ul className="social-links">
              <li>
                <a href="#" target="_blank" rel="noopener noreferrer">
                  Facebook
                </a>
              </li>
              <li>
                <a href="#" target="_blank" rel="noopener noreferrer">
                  Twitter
                </a>
              </li>
              <li>
                <a href="#" target="_blank" rel="noopener noreferrer">
                  Instagram
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} MyStore. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
