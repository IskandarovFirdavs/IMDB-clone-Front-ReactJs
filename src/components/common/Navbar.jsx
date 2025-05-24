"use client";

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { Search, Menu, X, User, BookOpen, LogOut } from "react-feather";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
      setIsOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    navigate("/");
  };

  return (
    <nav className="bg-[#032541] text-white shadow-md">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center flex-shrink-0">
              <span className="text-[#f5c518] font-bold text-2xl mr-1">
                IMDb
              </span>
              <span className="text-xl font-light">Clone</span>
            </Link>
            <div className="hidden md:ml-6 md:flex md:space-x-4">
              <Link
                to="/"
                className="px-3 py-2 rounded-md text-sm font-medium hover:bg-[#01b4e4] hover:text-white"
              >
                Home
              </Link>
              <Link
                to="/watchlist"
                className="px-3 py-2 rounded-md text-sm font-medium hover:bg-[#01b4e4] hover:text-white"
              >
                Watchlist
              </Link>
              <Link
                to="/news"
                className="px-3 py-2 rounded-md text-sm font-medium hover:bg-[#01b4e4] hover:text-white"
              >
                News
              </Link>
              <Link
                to="/trivia"
                className="px-3 py-2 rounded-md text-sm font-medium hover:bg-[#01b4e4] hover:text-white"
              >
                Trivia
              </Link>
              <Link
                to="/cast"
                className="px-3 py-2 rounded-md text-sm font-medium hover:bg-[#01b4e4] hover:text-white"
              >
                Cast
              </Link>
            </div>
          </div>
          <div className="flex items-center">
            <div className="hidden md:block">
              <form onSubmit={handleSearch} className="flex items-center">
                <input
                  type="text"
                  placeholder="Search titles, people..."
                  className="px-4 py-1 text-gray-800 rounded-l-md focus:outline-none"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button
                  type="submit"
                  className="bg-[#f5c518] p-1 rounded-r-md hover:bg-yellow-500"
                >
                  <Search size={20} className="text-gray-800" />
                </button>
              </form>
            </div>
            <div className="relative flex items-center ml-4">
              {currentUser ? (
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center focus:outline-none"
                  >
                    <div className="flex items-center justify-center w-8 h-8 bg-gray-300 rounded-full">
                      {currentUser.profile_picture ? (
                        <img
                          src={
                            currentUser.profile_picture || "/placeholder.svg"
                          }
                          alt={currentUser.username}
                          className="w-8 h-8 rounded-full"
                        />
                      ) : (
                        <User size={20} className="text-gray-600" />
                      )}
                    </div>
                  </button>
                  {showUserMenu && (
                    <div className="absolute right-0 z-10 w-48 py-1 mt-2 bg-white rounded-md shadow-lg">
                      <div className="px-4 py-2 text-sm text-gray-700 border-b">
                        Signed in as{" "}
                        <span className="font-medium">
                          {currentUser.username}
                        </span>
                      </div>
                      <Link
                        to="/watchlist"
                        className="flex items-center block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <BookOpen size={16} className="mr-2" />
                        My Watchlist
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex items-center block w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100"
                      >
                        <LogOut size={16} className="mr-2" />
                        Sign out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/login"
                  className="text-white hover:bg-[#01b4e4] px-3 py-2 rounded-md text-sm font-medium"
                >
                  Sign In
                </Link>
              )}
            </div>
            <div className="flex ml-2 md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-[#01b4e4] focus:outline-none"
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              to="/"
              className="block px-3 py-2 rounded-md text-base font-medium hover:bg-[#01b4e4]"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/watchlist"
              className="block px-3 py-2 rounded-md text-base font-medium hover:bg-[#01b4e4]"
              onClick={() => setIsOpen(false)}
            >
              Watchlist
            </Link>
            <Link
              to="/news"
              className="block px-3 py-2 rounded-md text-base font-medium hover:bg-[#01b4e4]"
              onClick={() => setIsOpen(false)}
            >
              News
            </Link>
            <Link
              to="/trivia"
              className="block px-3 py-2 rounded-md text-base font-medium hover:bg-[#01b4e4]"
              onClick={() => setIsOpen(false)}
            >
              Trivia
            </Link>
            <Link
              to="/cast"
              className="block px-3 py-2 rounded-md text-base font-medium hover:bg-[#01b4e4]"
              onClick={() => setIsOpen(false)}
            >
              Cast
            </Link>
          </div>
          <div className="pt-4 pb-3 border-t border-gray-700">
            <form onSubmit={handleSearch} className="flex px-2">
              <input
                type="text"
                placeholder="Search titles, people..."
                className="w-full px-4 py-2 text-gray-800 rounded-l-md focus:outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button
                type="submit"
                className="bg-[#f5c518] p-2 rounded-r-md hover:bg-yellow-500"
              >
                <Search size={20} className="text-gray-800" />
              </button>
            </form>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
