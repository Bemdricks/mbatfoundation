import { Linkedin, Twitter } from 'lucide-react';
import Terseer from '../images/Terseer.jpeg';
import Bem from '../images/Bem.jpeg';
import Sammy from'../images/Sammy.jpeg';
import Mavis from '../images/Mavis.jpeg';
import Damaris from '../images/Damaris.jpeg';

const boardTrustees = [
  {
    name: 'Terseer Kelvin Addingi',
    role: 'Founder & Executive Director',
    bio: 'Former College basketball player turned philantroph. Terseer founded MBAT with a vision to uplift youth through sport and learning.',
    image: Terseer,
  },
  {
    name: 'Nguumbur Damaris Uja',
    role: 'Board Member',
    bio: 'Damaris connects MBAT with families and communities, ensuring our programs reach those who need them most.',
    image: Damaris,
  },
  {
    name: 'Bem Benjamin De',
    role: 'Board Member',
    bio: 'Bem designs and oversees the academic programs that help children reach their full potential.',
    image: Bem,
  },
  {
    name: 'Mavis Hembadoon Ojiji',
    role: 'Board Member',
    bio: 'Mavis connects MBAT with families and communities, ensuring our programs reach those who need them most.',
    image: Mavis,
  },
  {
    name: 'Samson Adama',
    role: 'Board Member',
    bio: ' Samson also oversees the academic programs that help children reach their full potential.',
    image: Sammy,
  },
  
];

const technicalMembers =[
  {
    name: 'Coach Terkimbi Yende',
    role: 'Head of Basketball Programs',
    bio: 'A certified FIBA coach, Yende has developed basketball talent across West Africa and leads our elite training curriculum.',
    image: 'https://images.unsplash.com/photo-1605980776566-0486c3ac7617?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YmxhY2slMjBtYWxlJTIwcG90cmFpdHN8ZW58MHx8MHx8fDA%3D',
  },
];

function MemberCard({ member }: { member: { name: string; role: string; bio: string; image: string } }) {
  return (
    <div className="group text-center">
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
  );
}

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
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-orange-500 font-semibold text-sm uppercase tracking-widest">Board of Trustees</span>
          </div>

          <div className="mb-16">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {boardTrustees.map((member) => (
              <MemberCard key={member.name} member={member} />
            ))}
          </div>
        </div>
<hr className='border ' />
        <div className="text-center max-w-2xl mx-auto my-16">
          <span className="text-orange-500 font-semibold text-sm uppercase tracking-widest">Technical Members</span>
          </div>

        <div >
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {technicalMembers.map((member) => (
              <MemberCard key={member.name} member={member} />
            ))}
          </div>
        </div>
        
      </div>
    </section>
  );
}
