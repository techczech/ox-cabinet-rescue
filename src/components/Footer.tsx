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
          <p className="mt-1 text-xs">
            This is a prototype reconstruction for demonstration purposes.
          </p>
        </div>
      </div>
    </footer>
  );
}
