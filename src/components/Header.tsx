import { Link, NavLink } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { getSiteData } from '../services/dataService';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const siteData = getSiteData();

  return (
    <header className="bg-[var(--oxford-blue)] text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-[var(--oxford-gold)] rounded-full flex items-center justify-center">
              <span className="text-[var(--oxford-blue)] font-bold text-lg">C</span>
            </div>
            <span className="text-xl font-semibold tracking-wide">
              {siteData.name}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {siteData.navigation.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors hover:text-[var(--oxford-gold)] ${
                    isActive ? 'text-[var(--oxford-gold)]' : 'text-white'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden py-4 border-t border-white/20">
            {siteData.navigation.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setIsMenuOpen(false)}
                className={({ isActive }) =>
                  `block py-2 text-sm font-medium transition-colors hover:text-[var(--oxford-gold)] ${
                    isActive ? 'text-[var(--oxford-gold)]' : 'text-white'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
