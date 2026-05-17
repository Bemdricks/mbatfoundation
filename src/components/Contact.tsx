import { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

type FormState = { name: string; email: string; subject: string; message: string };
const empty: FormState = { name: '', email: '', subject: '', message: '' };

export default function Contact() {
  const [form, setForm] = useState<FormState>(empty);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handle = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const { error: err } = await supabase.from('contact_messages').insert([form]);
    setLoading(false);
    if (err) { setError('Something went wrong. Please try again.'); return; }
    setSuccess(true);
    setForm(empty);
    setTimeout(() => setSuccess(false), 6000);
  };

  return (
    <section id="contact" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-orange-500 font-semibold text-sm uppercase tracking-widest">Get In Touch</span>
          <h2 className="text-4xl sm:text-5xl font-black text-gray-900 mt-3 mb-4 leading-tight">
            Let's Build Something <span className="text-orange-500">Together</span>
          </h2>
          <p className="text-gray-500 text-lg leading-relaxed">
            Whether you want to volunteer, partner, sponsor, or simply learn more — we'd love to hear from you.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-12 items-start">
          <div className="lg:col-span-2 space-y-8">
            {[
              { icon: Mail, title: 'Email Us', detail: 'info@mbatfoundation.org', sub: 'We reply within 24 hours' },
              { icon: Phone, title: 'Call Us', detail: '+233 20 000 0000', sub: 'Mon–Fri, 8am–6pm' },
              { icon: MapPin, title: 'Visit Us', detail: 'Accra, Ghana', sub: 'Open for community visits' },
            ].map(({ icon: Icon, title, detail, sub }) => (
              <div key={title} className="flex gap-4 items-start">
                <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <Icon size={20} className="text-orange-500" />
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-sm">{title}</p>
                  <p className="text-gray-700 mt-0.5">{detail}</p>
                  <p className="text-gray-400 text-xs mt-0.5">{sub}</p>
                </div>
              </div>
            ))}

            <div className="bg-orange-500 rounded-3xl p-7 text-white">
              <h3 className="font-black text-xl mb-2">Volunteer With Us</h3>
              <p className="text-orange-100 text-sm leading-relaxed mb-4">
                Share your skills with young children. We welcome coaches, tutors, mentors, and more.
              </p>
              <a
                href="mailto:volunteer@mbatfoundation.org"
                className="inline-block bg-white text-orange-600 font-bold text-sm px-5 py-2.5 rounded-full hover:bg-orange-50 transition-colors"
              >
                Apply to Volunteer
              </a>
            </div>
          </div>

          <div className="lg:col-span-3 bg-white rounded-3xl shadow-sm p-8 sm:p-10">
            {success ? (
              <div className="flex flex-col items-center justify-center py-12 text-center gap-4">
                <CheckCircle size={52} className="text-emerald-500" />
                <h3 className="text-xl font-black text-gray-900">Message Sent!</h3>
                <p className="text-gray-500">Thank you for reaching out. We'll be in touch soon.</p>
              </div>
            ) : (
              <form onSubmit={submit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name</label>
                    <input
                      name="name"
                      value={form.name}
                      onChange={handle}
                      required
                      placeholder="Your name"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address</label>
                    <input
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handle}
                      required
                      placeholder="you@example.com"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Subject</label>
                  <select
                    name="subject"
                    value={form.subject}
                    onChange={handle}
                    required
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition bg-white"
                  >
                    <option value="">Select a subject</option>
                    <option>Donation Inquiry</option>
                    <option>Volunteer Application</option>
                    <option>Partnership Opportunity</option>
                    <option>Program Information</option>
                    <option>Media & Press</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Message</label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handle}
                    required
                    rows={5}
                    placeholder="Tell us how you'd like to get involved or any questions you have..."
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition resize-none"
                  />
                </div>
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-bold py-3.5 rounded-xl text-sm flex items-center justify-center gap-2 transition-all"
                >
                  {loading ? 'Sending...' : (<><Send size={16} /> Send Message</>)}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
