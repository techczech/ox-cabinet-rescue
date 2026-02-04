import { getSiteData } from '../services/dataService';

export default function Footer() {
  const siteData = getSiteData();

  return (
    <footer className="bg-[var(--oxford-blue)] text-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-[var(--oxford-gold)] mb-4">
              {siteData.name}
            </h3>
            <p className="text-sm text-gray-300">
              {siteData.tagline}
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-[var(--oxford-gold)] mb-4">
              Partners
            </h3>
            <ul className="text-sm text-gray-300 space-y-1">
              {siteData.partners.map((partner) => (
                <li key={partner}>{partner}</li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-[var(--oxford-gold)] mb-4">
              Contact
            </h3>
            <p className="text-sm text-gray-300">
              University of Oxford<br />
              Oxford Internet Institute<br />
              1 St Giles, Oxford OX1 3JS
            </p>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-white/20 text-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} University of Oxford. All rights reserved.</p>
          <p className="mt-2 text-xs">
            This is a prototype reconstruction for demonstration purposes.
          </p>
          <p className="mt-2">
            <a
              href="https://github.com/techczech/ox-cabinet-rescue"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-gray-400 hover:text-[var(--oxford-gold)] transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
              View source on GitHub
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
