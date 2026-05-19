import { BookOpen, Dribbble, GraduationCap, ArrowRight } from 'lucide-react';

const programs = [
  {
    icon: BookOpen,
    tag: 'Education',
    title: 'Academic Support Program',
    desc: 'We provide structured after-school tutoring, learning materials, and mentorship to help children achieve academic excellence.',
    features: ['After-school tutoring', 'Learning materials & supplies', 'Literacy & numeracy coaching', 'Academic mentors'],
    image: 'https://images.unsplash.com/photo-1610500796385-3ffc1ae2f046?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fGJsYWNrJTIwa2lkcyUyMGVkdWNhdGlvbnxlbnwwfHwwfHx8MA%3D%3D',
    color: 'from-blue-600 to-blue-800',
    accent: 'bg-blue-100 text-blue-600',
    cardBg: 'bg-blue-100',
  },
  {
    icon: Dribbble,
    tag: 'Sports',
    title: 'Basketball Development Program',
    desc: 'Our flagship sports program trains children in basketball from fundamentals to advanced play, building discipline and teamwork.',
    features: ['Certified coaching staff', 'Skills & drills training', 'Inter-school tournaments', 'Fitness & conditioning'],
    image: 'https://images.unsplash.com/photo-1559838831-d8fbd8af6469?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8YmxhY2slMjBraWRzJTIwYmFza2V0YmFsbHxlbnwwfHwwfHx8MA%3D%3D',
    color: 'from-orange-500 to-red-600',
    accent: 'bg-orange-100 text-orange-600',
    cardBg: 'bg-orange-100',
  },
  {
    icon: GraduationCap,
    tag: 'Leadership',
    title: 'Youth Leadership & Life Skills',
    desc: 'Beyond the classroom and court, we prepare young people for life — teaching communication, confidence, and community leadership.',
    features: ['Leadership workshops', 'Public speaking training', 'Community service projects', 'Career guidance'],
    image: 'https://images.unsplash.com/photo-1544476866-ce192b63bd7f?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8YmxhY2slMjBraWRzJTIwbGVhZGVyc2hpcHxlbnwwfHwwfHx8MA%3D%3D',
    color: 'from-emerald-600 to-teal-700',
    accent: 'bg-emerald-100 text-emerald-600',
    cardBg: 'bg-emerald-100',
  },
];

export default function Programs() {
  return (
    <section id="programs" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-orange-500 font-semibold text-sm uppercase tracking-widest">What We Do</span>
          <h2 className="text-4xl sm:text-5xl font-black text-gray-900 mt-3 mb-4 px-4 leading-tight">
            Programs That <span className="text-orange-500">Change Lives</span>
          </h2>
          <p className="text-gray-500 text-lg leading-relaxed">
            Three interconnected programs designed to develop the whole child — academically, physically, and personally.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-3">
          {programs.map((p) => {
            const Icon = p.icon;
            return (
              <div key={p.title} className={`${p.cardBg}  overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group hover:-translate-y-1`}>
                <div className="relative h-52 overflow-hidden">
                  <img
                    src={p.image}
                    alt={p.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${p.color} opacity-60`} />
                  <div className={`absolute top-4 left-4 inline-flex items-center gap-1.5 ${p.accent} text-xs font-bold  px-3 py-1.5`}>
                    <Icon size={12} />
                    {p.tag}
                  </div>
                </div>
                <div className="p-7">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{p.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed mb-5">{p.desc}</p>
                  <ul className="space-y-2 mb-6">
                    {p.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                        <span className="w-1.5 h-1.5 bg-orange-400 rounded-full flex-shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <a
                    href="#contact"
                    className="inline-flex items-center gap-1.5 text-orange-500 font-semibold text-sm hover:gap-3 transition-all"
                  >
                    Learn more <ArrowRight size={15} />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
