import { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Programs from './components/Programs';
import Impact from './components/Impact';
import Gallery from './components/Gallery';
import Team from './components/Team';
import Contact from './components/Contact';
import Footer from './components/Footer';
import DonateModal from './components/DonateModal';

function App() {
  const [donateOpen, setDonateOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      <Navbar onDonate={() => setDonateOpen(true)} />
      <Hero onDonate={() => setDonateOpen(true)} />
      <About />
      <Programs />
      <Impact />
      <Gallery />
      <Team />
      <Contact />
      <Footer onDonate={() => setDonateOpen(true)} />
      <DonateModal open={donateOpen} onClose={() => setDonateOpen(false)} />
    </div>
  );
}

export default App;
