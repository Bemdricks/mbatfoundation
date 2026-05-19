import { Facebook, Instagram, Twitter, Youtube } from 'lucide-react';

interface FooterProps {
  onDonate: () => void;
}

export default function Footer({ onDonate }: FooterProps) {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-16 pb-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-14">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-5">
            <img className='h-20 ' src="/src/mbatLogo.png" alt="mbatLogo" />
            </div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-sm mb-6">
              We empower young children through quality education and basketball training,
              building the next generation of leaders and champions.
            </p>
            <button
              onClick={onDonate}
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 py-3  text-sm transition-colors"
            >
              Support Our Mission
            </button>
          </div>

          <div>
            <h4 className="font-bold text-sm uppercase tracking-widest text-gray-300 mb-5">Quick Links</h4>
            <ul className="space-y-3">
              {[
                ['About Us', '#about'],
                ['Our Programs', '#programs'],
                ['Our Impact', '#impact'],
                ['Gallery', '#gallery'],
                ['Our Team', '#team'],
                ['Contact', '#contact'],
              ].map(([label, href]) => (
                <li key={label}>
                  <a href={href} className="text-gray-400 hover:text-orange-400 text-sm transition-colors">
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-sm uppercase tracking-widest text-gray-300 mb-5">Get Involved</h4>
            <ul className="space-y-3 mb-8">
              {['Donate', 'Volunteer', 'Partner With Us', 'Sponsor a Child', 'Corporate Giving'].map((item) => (
                <li key={item}>
                  <a href="#contact" className="text-gray-400 hover:text-orange-400 text-sm transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
            <h4 className="font-bold text-sm uppercase tracking-widest text-gray-300 mb-4">Follow Us</h4>
            <div className="flex gap-3">
              {[
                { Icon: Facebook, label: 'Facebook' },
                { Icon: Instagram, label: 'Instagram' },
                { Icon: Twitter, label: 'Twitter' },
                { Icon: Youtube, label: 'YouTube' },
              ].map(({ Icon, label }) => (
                <button
                  key={label}
                  aria-label={label}
                  className="w-9 h-9 bg-gray-800 hover:bg-orange-500 rounded-xl flex items-center justify-center transition-colors"
                >
                  <Icon size={16} className="text-gray-400 group-hover:text-white" />
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} MBAT Development Foundation. All rights reserved.
          </p>
          <div className="flex gap-5">
            <a href="#" className="text-gray-500 hover:text-gray-300 text-xs transition-colors">Privacy Policy</a>
            <a href="#" className="text-gray-500 hover:text-gray-300 text-xs transition-colors">Terms of Use</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
