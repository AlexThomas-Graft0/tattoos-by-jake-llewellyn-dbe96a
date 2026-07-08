export function Footer() {
  return (
    <footer className="bg-neutral-950 text-neutral-300 py-16 border-t border-neutral-800">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        
        <div className="space-y-4">
          <h3 className="text-white font-semibold text-lg uppercase tracking-wider">Studio</h3>
          <p className="text-sm leading-relaxed">
            6A Gwerthonor Place,<br />
            Gilfach, Bargoed,<br />
            CF81 8JQ
          </p>
          <a href="mailto:Nllewellyn975682@aol.com" className="block text-sm hover:text-white transition-colors">
            Nllewellyn975682@aol.com
          </a>
          <a href="tel:07729357006" className="block text-sm hover:text-white transition-colors">
            07729357006
          </a>
        </div>

        <div className="space-y-4">
          <h3 className="text-white font-semibold text-lg uppercase tracking-wider">Hours</h3>
          <ul className="text-sm space-y-2">
            <li className="flex justify-between"><span className="text-neutral-500">Mon</span> <span>Closed</span></li>
            <li className="flex justify-between"><span className="text-neutral-500">Tue - Fri</span> <span>10:30 - 18:00</span></li>
            <li className="flex justify-between"><span className="text-neutral-500">Sat</span> <span>10:00 - 16:00</span></li>
            <li className="flex justify-between"><span className="text-neutral-500">Sun</span> <span>Closed</span></li>
          </ul>
        </div>

        <div className="space-y-4">
          <h3 className="text-white font-semibold text-lg uppercase tracking-wider">Navigation</h3>
          <nav className="flex flex-col gap-2 text-sm">
            {['Hero', 'Experience', 'Portfolio', 'Services', 'Aftercare', 'Enquiry'].map((item) => (
              <a 
                key={item} 
                href={`#${item.toLowerCase()}`} 
                className="hover:text-white transition-colors"
              >
                {item}
              </a>
            ))}
          </nav>
        </div>

        <div className="space-y-4">
          <h3 className="text-white font-semibold text-lg uppercase tracking-wider">Connect</h3>
          <a 
            href="https://www.tattoosbyjakellewellyn.co.uk/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-block text-sm bg-white/5 border border-white/10 px-4 py-2 rounded-full hover:bg-white/10 transition-all"
          >
            Visit Official Website
          </a>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-white/10 text-center text-xs text-neutral-600">
        <p>© 2024 Tattoos by Jake Llewellyn. All Rights Reserved.</p>
      </div>
    </footer>
  );
}