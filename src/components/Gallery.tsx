

const images = [
  {
    src: 'src/gallery/basketball-training.jpg',
    alt: 'Basketball training session',
    span: 'col-span-2 row-span-2',
  },
  {
    src: 'src/gallery/classroom.jpg',
    alt: 'Children in classroom',
    span: '',
  },
  {
    src: 'src/gallery/mbat003.jpg',
    alt: 'Basketball game',
    span: '',
  },
  {
    src: 'src/gallery/youthBasketball.jpeg',
    alt: 'Youth basketball player',
    span: '',
  },
  {
    src: 'src/gallery/mbt001.jpg',
    alt: 'Youth leadership workshop',
    span: '',
  },
  {
    src: 'src/gallery/classroom2.jpg',
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
              className={`relative  overflow-hidden group ${img.span}`}
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
