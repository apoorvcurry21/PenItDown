import { useState } from "react";
import { Container, LogoutBtn } from "../index";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function Header() {
  const authStatus = useSelector((state) => state.auth.status);
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    {
      name: "Home",
      slug: "/",
      active: true,
    },
    {
      name: "Login",
      slug: "/login",
      active: !authStatus,
    },
    {
      name: "Signup",
      slug: "/signup",
      active: !authStatus,
    },
    {
      name: "All Posts",
      slug: "/all-posts",
      active: authStatus,
    },
    {
      name: "Add Post",
      slug: "/add-post",
      active: authStatus,
    },
  ];

  return (
    <header className="sticky top-0 z-50 bg-gray-900/80 backdrop-blur-sm border-b border-gray-800">
      <Container>
        <nav className="flex flex-wrap items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="flex items-center p-2 group">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold pl-2 sm:pl-4 bg-gradient-to-r from-teal-400 to-cyan-500 bg-clip-text text-transparent group-hover:from-cyan-500 group-hover:to-teal-400 transition-all duration-300">
                PENITDOWN
              </h1>
            </Link>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-200 hover:text-teal-400 focus:outline-none p-2 transition-colors duration-200"
              aria-label="Toggle menu"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          {/* Desktop menu */}
          <ul className="hidden md:flex ml-auto space-x-4">
            {navItems.map((item) =>
              item.active ? (
                <li key={item.name}>
                  <button
                    onClick={() => navigate(item.slug)}
                    className={`inline-block px-4 py-2 text-sm font-medium transition-all duration-200 rounded-lg ${
                      window.location.pathname === item.slug 
                        ? "bg-teal-500 text-gray-900 shadow-lg shadow-teal-500/20" 
                        : "text-gray-300 hover:bg-gray-800 hover:text-teal-400"
                    }`}
                  >
                    {item.name}
                  </button>
                </li>
              ) : null
            )}
            {authStatus && (
              <li>
                <LogoutBtn />
              </li>
            )}
          </ul>

          {/* Mobile menu */}
          {isMenuOpen && (
            <ul className="w-full md:hidden mt-4 space-y-2 bg-gray-800/90 backdrop-blur-sm rounded-lg p-4 border border-gray-700">
              {navItems.map((item) =>
                item.active ? (
                  <li key={item.name}>
                    <button
                      onClick={() => {
                        navigate(item.slug);
                        setIsMenuOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm font-medium transition-all duration-200 rounded-lg ${
                        window.location.pathname === item.slug 
                          ? "bg-teal-500 text-gray-900" 
                          : "text-gray-300 hover:bg-gray-700 hover:text-teal-400"
                      }`}
                    >
                      {item.name}
                    </button>
                  </li>
                ) : null
              )}
              {authStatus && (
                <li>
                  <LogoutBtn />
                </li>
              )}
            </ul>
          )}
        </nav>
      </Container>
    </header>
  );
}

export default Header;
