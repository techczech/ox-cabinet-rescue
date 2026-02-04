import { Users, Building, Award } from 'lucide-react';
import { getSiteData } from '../services/dataService';

export default function About() {
  const siteData = getSiteData();

  return (
    <div className="min-h-screen bg-[var(--cabinet-warm)]">
      {/* Header */}
      <div className="bg-[var(--oxford-blue)] text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold mb-4">About Cabinet</h1>
          <p className="text-gray-300 max-w-2xl">
            {siteData.tagline}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Mission Section */}
        <section className="mb-16">
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold text-[var(--oxford-blue)] mb-6">
              Platform Overview
            </h2>
            <div className="prose prose-lg max-w-none text-gray-700">
              <p>{siteData.description}</p>
              <p className="mt-4">
                Cabinet features high-resolution 2D images and 3D models of objects
                from coins to monuments, sourced from Oxford's collections and integrated
                with IIIF-compliant resources from cultural institutions worldwide.
              </p>
              <p className="mt-4">
                The platform provides tools for "digital object handling", annotation,
                and discussion designed to work across computers and mobile devices,
                supporting a rich, interactive learning environment.
              </p>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-[var(--oxford-blue)] mb-8 flex items-center gap-3">
            <Users className="text-[var(--oxford-gold)]" />
            Leadership Team
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {siteData.team.current.map((member) => (
              <div
                key={member.name}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <div className="w-16 h-16 bg-[var(--oxford-blue)]/10 rounded-full flex items-center justify-center mb-4">
                  <span className="text-2xl font-bold text-[var(--oxford-blue)]">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <h3 className="font-semibold text-[var(--oxford-blue)] mb-1">
                  {member.name}
                </h3>
                <p className="text-sm text-gray-600 mb-2">{member.role}</p>
                <p className="text-xs text-gray-500">{member.affiliation}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 bg-white rounded-lg shadow-md p-6">
            <h3 className="font-semibold text-[var(--oxford-blue)] mb-4 flex items-center gap-2">
              <Award size={20} className="text-[var(--oxford-gold)]" />
              Past Contributors
            </h3>
            <div className="flex flex-wrap gap-2">
              {siteData.team.past.map((name) => (
                <span
                  key={name}
                  className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                >
                  {name}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Partners Section */}
        <section>
          <h2 className="text-2xl font-bold text-[var(--oxford-blue)] mb-8 flex items-center gap-3">
            <Building className="text-[var(--oxford-gold)]" />
            Supporting Organizations
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {siteData.partners.map((partner) => (
              <div
                key={partner}
                className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow"
              >
                <div className="w-12 h-12 bg-[var(--oxford-blue)]/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Building className="text-[var(--oxford-blue)]" size={24} />
                </div>
                <p className="text-sm font-medium text-gray-700">{partner}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Technical Info */}
        <section className="mt-16">
          <div className="bg-[var(--oxford-blue)] text-white rounded-lg p-8">
            <h2 className="text-xl font-bold mb-4">Technical Information</h2>
            <div className="grid md:grid-cols-3 gap-6 text-sm">
              <div>
                <h3 className="text-[var(--oxford-gold)] font-semibold mb-2">Standards</h3>
                <ul className="space-y-1 text-gray-300">
                  <li>IIIF Image API</li>
                  <li>IIIF Presentation API</li>
                  <li>Dublin Core Metadata</li>
                </ul>
              </div>
              <div>
                <h3 className="text-[var(--oxford-gold)] font-semibold mb-2">Features</h3>
                <ul className="space-y-1 text-gray-300">
                  <li>High-resolution 2D images</li>
                  <li>Interactive 3D models</li>
                  <li>Annotation tools</li>
                </ul>
              </div>
              <div>
                <h3 className="text-[var(--oxford-gold)] font-semibold mb-2">Compatibility</h3>
                <ul className="space-y-1 text-gray-300">
                  <li>Desktop browsers</li>
                  <li>Mobile devices</li>
                  <li>Tablet devices</li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
