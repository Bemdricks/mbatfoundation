import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import Logo from '../mbatLogo.png';

interface NavbarProps {
  onDonate: () => void;
}

const links = [
  { label: 'About', href: '#about' },
  { label: 'Programs', href: '#programs' },
  { label: 'Impact', href: '#impact' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'Team', href: '#team' },
  { label: 'Contact', href: '#contact' },
];

export default function Navbar({ onDonate }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white shadow-md py-3' : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        <a href="#" className="flex items-center gap-3 group">
        <img className=' h-20 my-4' src={Logo} alt="mbatLogo" />
        </a>

        <nav className="hidden md:flex items-center gap-7">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className={`text-sm font-medium transition-colors hover:text-orange-500 ${
                scrolled ? 'text-gray-700' : 'text-white/90'
              }`}
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <button
            onClick={onDonate}
            className="hidden md:inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-5 py-2.5  text-sm transition-all shadow-md hover:shadow-lg active:scale-95"
          >
            Donate Now
          </button>
          <button
            onClick={() => setOpen(!open)}
            className={`md:hidden p-2  transition-colors ${scrolled ? 'text-gray-700 hover:bg-gray-100' : 'text-white hover:bg-white/10'}`}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-xl">
          <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-1">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="text-gray-700 hover:text-orange-500 font-medium py-2.5 px-3 rounded-lg hover:bg-orange-50 transition-colors text-sm"
              >
                {l.label}
              </a>
            ))}
            <button
              onClick={() => { setOpen(false); onDonate(); }}
              className="mt-2 bg-orange-500 text-white font-semibold py-3 rounded-full text-sm"
            >
              Donate Now
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
