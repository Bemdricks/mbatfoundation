import { ArrowDown, Heart } from 'lucide-react';

interface HeroProps {
  onDonate: () => void;
}

export default function Hero({ onDonate }: HeroProps) {
  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{
        backgroundImage:
          'url(https://images.pexels.com/photos/2277981/pexels-photo-2277981.jpeg?auto=compress&cs=tinysrgb&w=1600)',
        backgroundSize: 'cover',
        backgroundPosition: 'center top',
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900/85 via-gray-900/70 to-orange-900/60" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center mt-40">
        <div className="inline-flex items-center gap-2 bg-orange-500/20 border border-orange-400/40 text-orange-300 text-xs font-semibold tracking-widest uppercase px-4 py-2 mb-8">
          <Heart size={12} className="fill-orange-400 text-orange-400" />
          Empowering Young Lives
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white leading-tight mb-6">
          Building Futures Through{' '}
          <span className="text-orange-400">Education</span> &amp;{' '}
          <span className="text-orange-400">Sport</span>
        </h1>

        <p className="text-gray-300 text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
          MDF Development Foundation empowers young children with quality education,
          life skills, and world-class basketball training — shaping champions on and off the court.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={onDonate}
            className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 py-4 text-base transition-all shadow-xl hover:shadow-orange-500/30 hover:-translate-y-0.5 active:scale-95 min-w-[180px]"
          >
            Donate Now
          </button>
          <a
            href="#camp"
            className="border-2 border-white/50 hover:border-white text-white font-semibold px-8 py-4 text-base transition-all hover:bg-white/10 min-w-[180px] text-center"
          >
            Register for Camp
          </a>
        </div>

        <div className="mt-16 mb-10 grid grid-cols-3 gap-6 max-w-lg mx-auto">
          {[
            { value: '50+', label: 'Children Supported' },
            { value: 'First', label: 'Year of Impact' },
            { value: '3', label: 'Programs Running' },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-3xl font-black text-orange-400">{s.value}</p>
              <p className="text-white/70 text-xs mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      <a
        href="#about"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/60 hover:text-white transition-colors animate-bounce"
      >
        <ArrowDown size={24} />
      </a>
    </section>
  );
}
