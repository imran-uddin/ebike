import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">e</span>
              </div>
              <span className="font-semibold text-white text-lg">
                e-motion
              </span>
            </div>
            <p className="text-sm text-gray-400">
              Europas größtes Netzwerk unabhängiger e-Bike Experten. Über 100
              Standorte in Deutschland, Österreich und der Schweiz.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-3 text-sm">e-Bikes</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/bikes?category=trekking" className="hover:text-white transition-colors">Trekking e-Bike</Link>
              </li>
              <li>
                <Link href="/bikes?category=city" className="hover:text-white transition-colors">City e-Bike</Link>
              </li>
              <li>
                <Link href="/bikes?category=mountain" className="hover:text-white transition-colors">e-Mountainbike</Link>
              </li>
              <li>
                <Link href="/bikes?category=cargo" className="hover:text-white transition-colors">Lastenrad</Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-3 text-sm">Service</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/stores" className="hover:text-white transition-colors">Händler finden</Link>
              </li>
              <li>
                <span className="text-gray-500">Werkstatt-Termin</span>
              </li>
              <li>
                <span className="text-gray-500">Leasing-Beratung</span>
              </li>
              <li>
                <span className="text-gray-500">Finanzierung</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-3 text-sm">
              Unternehmen
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <span className="text-gray-500">Über e-motion</span>
              </li>
              <li>
                <span className="text-gray-500">Franchisepartner werden</span>
              </li>
              <li>
                <span className="text-gray-500">Impressum</span>
              </li>
              <li>
                <span className="text-gray-500">Datenschutz</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-sm text-gray-500 text-center">
          POC Demo — e-motion Webshop Concept
        </div>
      </div>
    </footer>
  );
}
