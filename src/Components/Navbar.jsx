import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useCart } from "./CartContext";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const { user, logout } = useAuth();

  const location = useLocation();
  const navigate = useNavigate();
  const { cart, isOpen, setIsOpen } = useCart();

  const { theme, toggleTheme } = useTheme();

  const handleLogout = () => {
    logout();
    navigate("/signin");
  };

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScroll = window.scrollY;
      const goingDown = currentScroll > lastScrollY;

      if (Math.abs(currentScroll - lastScrollY) > 8) {
        setHidden(goingDown && currentScroll > 80);
        lastScrollY = currentScroll;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navlinks = user
    ? [{ name: "Home", path: "/" }]
    : [
        { name: "Home", path: "/" },
        { name: "Signup", path: "/signup" },
        { name: "Signin", path: "/signin" },
      ];

  return (
    <>
      <nav className={`navbar ${hidden ? "hidden" : "visible"}`}>
        <div className="nav-container">
          <img src="/public/Limpr_3K.jpeg" alt="" width={40} />
          <h1 className="logo">Skins</h1>

          <ul className={`nav-links ${menuOpen ? "active" : ""}`}>
            {navlinks.map((link) => (
              <li key={link.path}>
                <Link
                  to={link.path}
                  className={location.pathname === link.path ? "active" : ""}
                  onClick={() => setMenuOpen(false)}
                >
                  {link.name}
                </Link>
              </li>
            ))}

            {user && (
              <li>
                <button className="logout-btn" onClick={handleLogout}>
                  Logout
                </button>
              </li>
            )}
          </ul>

          <div className="nav-actions" style={{ display: "flex", gap: "8px" }}>
            <div className="cart-icon" onClick={() => setIsOpen(!isOpen)}>
              🛒
              {cart.length > 0 && (
                <span className="cart-badge">{cart.length}</span>
              )}
            </div>

            {/* THEME TOGGLE  */}
            <button className="theme-btn" onClick={toggleTheme}>
              {theme === "dark" ? "☀️" : "🌙"}
            </button>

            <button
              className="hamburger"
              onClick={() => setMenuOpen((prev) => !prev)}
            >
              <span className="bar" />
              <span className="bar" />
              <span className="bar" />
            </button>
          </div>
        </div>
      </nav>

      {menuOpen && (
        <div className="menu-overlay" onClick={() => setMenuOpen(false)} />
      )}
    </>
  );
};

export default Navbar;
