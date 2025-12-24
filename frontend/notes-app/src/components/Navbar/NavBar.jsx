import React, { useState } from "react";
import Profile from "../Cards/Profile";
import { useNavigate, useLocation } from "react-router-dom";
import SearchBar from "../SearchBar/SearchBar";

const Navbar = ({ userInfo, onSearchNote, handleClearSearch }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const onLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handleSearch = () => {
    if (searchQuery) onSearchNote(searchQuery);
  };

  const onClearSearch = () => {
    setSearchQuery("");
    handleClearSearch();
  };

  const hideOn = ["/login", "/signUp"];
  if (hideOn.includes(location.pathname)) {
    return null; // Don't render Navbar
  }
  
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <div className="bg-gradient-to-r from-[#DCFCE7] via-[#FFFFFF] to-[#DCFCE7] px-4 sm:px-6 py-3 shadow-md border-b border-[#16A34A]/30">
      {/* Desktop view */}
      <div className="hidden sm:flex sm:flex-row sm:items-center sm:justify-between sm:gap-0">
        <div className="flex items-center">
          <h2 className="text-2xl font-extrabold tracking-tight drop-shadow-sm text-[#1E293B]">
            <span className="inline-block text-[#16A34A] hover:scale-105 transition-transform duration-300">
              Leaf
            </span>
            <span className="inline-block text-[#B45309]">Note</span>
          </h2>
        </div>

        <div className="w-auto">
          <SearchBar
            value={searchQuery}
            onChange={({ target }) => setSearchQuery(target.value)}
            handleSearch={handleSearch}
            onClearSearch={onClearSearch}
          />
        </div>

        <Profile userInfo={userInfo} onLogout={onLogout} />
      </div>

      {/* Mobile view */}
      <div className="sm:hidden">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-extrabold tracking-tight text-[#16A34A] drop-shadow-sm">
            <span className="text-[#16A34A]">Leaf</span>
            <span className="text-[#B45309]">Note</span>
          </h2>

          <button
            className="focus:outline-none"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6 text-[#1E293B]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {isMenuOpen && (
          <div className="mt-3 flex flex-col gap-3">
            <SearchBar
              value={searchQuery}
              onChange={({ target }) => setSearchQuery(target.value)}
              handleSearch={handleSearch}
              onClearSearch={onClearSearch}
            />
            <div className="mt-2">
              <Profile userInfo={userInfo} onLogout={onLogout} />
            </div>
          </div>
        )}
      </div>
    </div>
  ); // <--- Added missing closing parenthesis here
};

export default Navbar;