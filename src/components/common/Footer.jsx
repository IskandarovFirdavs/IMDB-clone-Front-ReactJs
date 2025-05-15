import { Link } from "react-router-dom"
import { Facebook, Twitter, Instagram, GitHub } from "react-feather"

const Footer = () => {
  return (
    <footer className="bg-[#032541] text-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">IMDb Clone</h3>
            <p className="text-sm text-gray-300">
              A movie database application built with React and Django REST Framework.
            </p>
            <div className="flex space-x-4 mt-4">
              <a href="#" className="text-gray-300 hover:text-white">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-white">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-white">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-white">
                <GitHub size={20} />
              </a>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Navigation</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-gray-300 hover:text-white">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/watchlist" className="text-gray-300 hover:text-white">
                  Watchlist
                </Link>
              </li>
              <li>
                <Link to="/news" className="text-gray-300 hover:text-white">
                  News
                </Link>
              </li>
              <li>
                <Link to="/trivia" className="text-gray-300 hover:text-white">
                  Trivia
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Categories</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/search?type=MOVIE" className="text-gray-300 hover:text-white">
                  Movies
                </Link>
              </li>
              <li>
                <Link to="/search?type=TV_SERIES" className="text-gray-300 hover:text-white">
                  TV Series
                </Link>
              </li>
              <li>
                <Link to="/search?type=TV_EPISODE" className="text-gray-300 hover:text-white">
                  TV Episodes
                </Link>
              </li>
              <li>
                <Link to="/search?type=VIDEO_GAME" className="text-gray-300 hover:text-white">
                  Video Games
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-gray-300 hover:text-white">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white">
                  Cookie Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white">
                  GDPR
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-700 text-sm text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} IMDb Clone. All rights reserved.</p>
          <p className="mt-2">This is a demo project and not affiliated with IMDb or Amazon.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
