import { TrendingUp, Award, MapPin, Star } from 'lucide-react';

const stats = [
  { icon: TrendingUp, value: '500+', label: 'Children Supported', desc: 'Through education and sports programs' },
  { icon: Award, value: '87%', label: 'Academic Improvement', desc: 'Of enrolled students show grade improvement' },
  { icon: MapPin, value: '8', label: 'Communities Reached', desc: 'Across multiple districts and regions' },
  { icon: Star, value: '40+', label: 'Tournament Wins', desc: 'By our basketball teams in inter-school competitions' },
];

const testimonials = [
  {
    name: 'Amara K.',
    role: 'Program Graduate, now University Student',
    quote: 'MBAT gave me the discipline to study and the confidence to lead. Basketball taught me that hard work always pays off. Today I am at university on a scholarship.',
    image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=200',
  },
  {
    name: 'David O.',
    role: 'Parent of Two Program Participants',
    quote: 'I have watched my children transform. They are more focused, disciplined, and happy. MBAT is not just about basketball — it is about building good human beings.',
    image: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=200',
  },
  {
    name: 'Coach James T.',
    role: 'Lead Basketball Coach',
    quote: 'Every child who walks through our doors has potential. Our job is to unlock it. Watching these kids grow into confident young adults is the greatest reward.',
    image: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=200',
  },
];

export default function Impact() {
  return (
    <section id="impact" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-orange-500 font-semibold text-sm uppercase tracking-widest">Our Impact</span>
          <h2 className="text-4xl sm:text-5xl font-black text-gray-900 mt-3 mb-4 leading-tight">
            Real Numbers, <span className="text-orange-500">Real Change</span>
          </h2>
          <p className="text-gray-500 text-lg leading-relaxed">
            Every statistic represents a young person whose life has been touched by our programs.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {stats.map(({ icon: Icon, value, label, desc }) => (
            <div key={label} className="text-center bg-gray-50 rounded-3xl p-8 hover:bg-orange-50 transition-colors group">
              <div className="w-14 h-14 bg-orange-100 group-hover:bg-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4 transition-colors">
                <Icon size={24} className="text-orange-500 group-hover:text-white transition-colors" />
              </div>
              <p className="text-4xl font-black text-gray-900 mb-1">{value}</p>
              <p className="font-bold text-gray-800 text-sm mb-1">{label}</p>
              <p className="text-gray-400 text-xs leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>

        <div className="bg-gray-900 rounded-3xl overflow-hidden">
          <div className="p-10 sm:p-14">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-black text-white">Voices From Our Community</h3>
              <p className="text-gray-400 mt-2">Stories that remind us why we do this work</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {testimonials.map((t) => (
                <div key={t.name} className="bg-gray-800/50 rounded-2xl p-6 hover:bg-gray-800 transition-colors">
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} className="fill-orange-400 text-orange-400" />
                    ))}
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed mb-6 italic">"{t.quote}"</p>
                  <div className="flex items-center gap-3">
                    <img
                      src={t.image}
                      alt={t.name}
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-orange-500/40"
                    />
                    <div>
                      <p className="text-white font-semibold text-sm">{t.name}</p>
                      <p className="text-gray-500 text-xs">{t.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
