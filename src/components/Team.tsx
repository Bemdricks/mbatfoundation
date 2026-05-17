import { Linkedin, Twitter } from 'lucide-react';

const team = [
  {
    name: 'Michael B. Asante',
    role: 'Founder & Executive Director',
    bio: 'Former professional basketball player turned educator. Michael founded MBAT with a vision to uplift youth through sport and learning.',
    image: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    name: 'Abena T. Mensah',
    role: 'Director of Education',
    bio: 'With 15 years in childhood education, Abena designs and oversees the academic programs that help children reach their full potential.',
    image: 'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    name: 'Coach James Tetteh',
    role: 'Head of Basketball Programs',
    bio: 'A certified FIBA coach, James has developed basketball talent across West Africa and leads our elite training curriculum.',
    image: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    name: 'Sandra Osei',
    role: 'Community Outreach Coordinator',
    bio: 'Sandra connects MBAT with families and communities, ensuring our programs reach those who need them most.',
    image: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
];

export default function Team() {
  return (
    <section id="team" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-orange-500 font-semibold text-sm uppercase tracking-widest">Our Team</span>
          <h2 className="text-4xl sm:text-5xl font-black text-gray-900 mt-3 mb-4 leading-tight">
            The People Behind <span className="text-orange-500">MBAT</span>
          </h2>
          <p className="text-gray-500 text-lg leading-relaxed">
            A passionate team of educators, coaches, and community builders united by a common purpose.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {team.map((member) => (
            <div key={member.name} className="group text-center">
              <div className="relative mb-5 inline-block">
                <div className="w-40 h-40 mx-auto rounded-3xl overflow-hidden shadow-lg group-hover:shadow-xl transition-shadow">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-400"
                  />
                </div>
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 bg-white rounded-full px-3 py-1.5 shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="text-gray-400 hover:text-blue-500 transition-colors">
                    <Linkedin size={14} />
                  </button>
                  <button className="text-gray-400 hover:text-sky-500 transition-colors">
                    <Twitter size={14} />
                  </button>
                </div>
              </div>
              <h3 className="font-bold text-gray-900 text-base mt-2">{member.name}</h3>
              <p className="text-orange-500 text-xs font-semibold uppercase tracking-wide mt-0.5 mb-3">{member.role}</p>
              <p className="text-gray-500 text-sm leading-relaxed max-w-xs mx-auto">{member.bio}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
