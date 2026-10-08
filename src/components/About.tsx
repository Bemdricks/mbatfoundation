import { Target, Eye, Users } from 'lucide-react';
import bgPic from '../gallery/bg.jpg';

export default function About() {
  return (
    <section id="about" className="py-24 bg-gradient-to-r from-gray-100 to-blue-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-orange-500 font-semibold text-sm uppercase tracking-widest">Who We Are</span>
            <h2 className="text-4xl sm:text-5xl font-black text-gray-900 mt-3 mb-6 leading-tight">
              More Than a Foundation —<br />
              <span className="text-orange-500">A Community</span>
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed mb-6">
              MDF Development Foundation was established with a single purpose: to give every young child
              the tools they need to succeed. We believe that access to quality education and structured
              sports programs transforms not just individuals, but entire communities.
            </p>
            <p className="text-gray-600 leading-relaxed mb-10">
              Through our integrated approach, we pair academic support with basketball training — teaching
              discipline, teamwork, perseverance, and leadership alongside reading, writing, and numeracy.
            </p>

            <div className="grid sm:grid-cols-3 gap-2">
              {[
                {
                  icon: Target,
                  title: 'Our Mission',
                  desc: 'To nurture the potential of every child through education and sport.',
                },
                {
                  icon: Eye,
                  title: 'Our Vision',
                  desc: 'A world where every child thrives, regardless of circumstance.',
                },
                {
                  icon: Users,
                  title: 'Our Approach',
                  desc: 'Holistic development that unites learning, play, and mentorship.',
                },
              ].map(({ icon: Icon, title, desc }) => (
                <div key={title} className="bg-gray-100 p-5 hover:bg-orange-50 transition-colors group">
                  <div className="w-10 h-10 bg-orange-100 group-hover:bg-orange-500 flex items-center justify-center mb-3 transition-colors">
                    <Icon size={18} className="text-orange-500 group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="font-bold text-gray-900 text-sm mb-1">{title}</h3>
                  <p className="text-gray-500 text-xs leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="relative overflow-hidden rounded-3xl shadow-2xl">
              <img
                src={bgPic}
                alt="Children learning"
                className="w-full h-[520px] rounded-3xl object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/40 to-transparent" />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-white shadow-xl p-5 max-w-[220px]">
              <p className="text-3xl font-black text-orange-500">50+</p>
              <p className="text-gray-700 font-semibold text-sm">Children empowered</p>
              <p className="text-gray-400 text-xs mt-1">across our programs since founding</p>
            </div>
            <div className="absolute -top-6 -right-6 bg-orange-500 shadow-xl p-5 max-w-[180px]">
              <p className="text-3xl font-black text-white">First</p>
              <p className="text-white/90 font-semibold text-sm">Year of service</p>
              <p className="text-orange-200 text-xs mt-1">creating lasting change</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
