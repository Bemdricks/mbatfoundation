const images = [
  {
    src: 'https://images.pexels.com/photos/1752757/pexels-photo-1752757.jpeg?auto=compress&cs=tinysrgb&w=800',
    alt: 'Basketball training session',
    span: 'col-span-2 row-span-2',
  },
  {
    src: 'https://images.pexels.com/photos/8613089/pexels-photo-8613089.jpeg?auto=compress&cs=tinysrgb&w=600',
    alt: 'Children in classroom',
    span: '',
  },
  {
    src: 'https://images.pexels.com/photos/2277981/pexels-photo-2277981.jpeg?auto=compress&cs=tinysrgb&w=600',
    alt: 'Basketball game',
    span: '',
  },
  {
    src: 'https://images.pexels.com/photos/1596902/pexels-photo-1596902.jpeg?auto=compress&cs=tinysrgb&w=600',
    alt: 'Youth basketball player',
    span: '',
  },
  {
    src: 'https://images.pexels.com/photos/8613312/pexels-photo-8613312.jpeg?auto=compress&cs=tinysrgb&w=600',
    alt: 'Youth leadership workshop',
    span: '',
  },
  {
    src: 'https://images.pexels.com/photos/1720186/pexels-photo-1720186.jpeg?auto=compress&cs=tinysrgb&w=800',
    alt: 'Students studying',
    span: 'col-span-2',
  },
];

export default function Gallery() {
  return (
    <section id="gallery" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-orange-500 font-semibold text-sm uppercase tracking-widest">Gallery</span>
          <h2 className="text-4xl sm:text-5xl font-black text-gray-900 mt-3 mb-4 leading-tight">
            Moments That <span className="text-orange-500">Matter</span>
          </h2>
          <p className="text-gray-500 text-lg leading-relaxed">
            A glimpse into the daily lives, training sessions, and milestones of our incredible children.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 auto-rows-[220px] gap-4">
          {images.map((img, i) => (
            <div
              key={i}
              className={`relative rounded-2xl overflow-hidden group ${img.span}`}
            >
              <img
                src={img.src}
                alt={img.alt}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gray-900/0 group-hover:bg-gray-900/30 transition-colors duration-300" />
              <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <p className="text-white font-semibold text-sm">{img.alt}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
