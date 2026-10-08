import { useState } from 'react';
import PaystackPop from '@paystack/inline-js';
import { CalendarDays, MapPin, Users, Trophy, CheckCircle, ClipboardList, Banknote } from 'lucide-react';
import { initializeCampRegistration, verifyCampRegistration } from '../lib/api';
import campHero from '../gallery/basketball-training.jpg';

type FormState = {
  full_name: string;
  gender: string;
  age: string;
  phone: string;
  email: string;
  age_group: string;
  position: string;
  experience: string;
  guardian_name: string;
  guardian_phone: string;
  tshirt_size: string;
  medical_notes: string;
};

const empty: FormState = {
  full_name: '',
  gender: '',
  age: '',
  phone: '',
  email: '',
  age_group: '',
  position: '',
  experience: '',
  guardian_name: '',
  guardian_phone: '',
  tshirt_size: '',
  medical_notes: '',
};

const inputClass =
  'w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition bg-white';

export default function Camp() {
  const [form, setForm] = useState<FormState>(empty);
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const ageNum = parseInt(form.age, 10);
  const needsGuardian = !Number.isNaN(ageNum) && ageNum < 18;

  const handle = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!consent) {
      setError('Please confirm you have permission to register.');
      return;
    }
    if (Number.isNaN(ageNum) || ageNum < 8 || ageNum > 25) {
      setError('Participants must be between 8 and 25 years old.');
      return;
    }
    if (needsGuardian && (!form.guardian_name.trim() || !form.guardian_phone.trim())) {
      setError('Parent or guardian name and phone are required for participants under 18.');
      return;
    }

    const publicKey = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY;
    if (!publicKey) {
      setError('Payment is not configured. Please contact support.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { access_code, reference } = await initializeCampRegistration({
        full_name: form.full_name.trim(),
        gender: form.gender,
        age: ageNum,
        phone: form.phone.trim(),
        email: form.email.trim(),
        age_group: form.age_group,
        position: form.position,
        experience: form.experience,
        guardian_name: form.guardian_name.trim(),
        guardian_phone: form.guardian_phone.trim(),
        tshirt_size: form.tshirt_size,
        medical_notes: form.medical_notes.trim(),
      });

      const paystack = new PaystackPop();
      paystack.resumeTransaction(access_code, {
        onSuccess: async (transaction) => {
          try {
            await verifyCampRegistration(transaction.reference || reference);
            setSuccess(true);
            setForm(empty);
            setConsent(false);
          } catch {
            setError('Payment received but confirmation failed. Please contact us with your reference.');
          } finally {
            setLoading(false);
          }
        },
        onCancel: () => {
          setLoading(false);
          setError('Payment cancelled. Your spot is not reserved until the ₦1,000 fee is paid.');
        },
        onError: (err) => {
          setLoading(false);
          setError(err.message || 'Payment failed. Please try again.');
        },
      });
    } catch (err) {
      setLoading(false);
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    }
  };

  return (
    <section id="camp" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="relative overflow-hidden mb-14 min-h-[320px] sm:min-h-[380px] flex items-end">
          <img src={campHero} alt="Players at basketball training" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 via-gray-900/75 to-orange-900/55" />
          <div className="relative z-10 p-6 sm:p-10 lg:p-12 max-w-3xl">
            <span className="inline-flex items-center gap-2 bg-orange-500 text-white text-xs font-bold uppercase tracking-widest px-3 py-1.5 mb-4">
              Open Registration
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight mb-3">
              3-Day Basketball Camp &amp; Tournament
            </h2>
            <p className="text-orange-100 text-base sm:text-lg leading-relaxed mb-6">
              Kids and young adults, join MBAT for three days of skills, games, and competition —
              26th to 28th December 2026 in Kusuv Village, Buruku LGA, Benue State.
            </p>
            <div className="flex flex-wrap gap-3 text-sm text-white">
              <span className="inline-flex items-center gap-2 bg-white/10 border border-white/20 px-3 py-2">
                <CalendarDays size={16} className="text-orange-400" />
                26–28 Dec 2026
              </span>
              <span className="inline-flex items-center gap-2 bg-white/10 border border-white/20 px-3 py-2">
                <MapPin size={16} className="text-orange-400" />
                Kusuv Village, Buruku
              </span>
              <span className="inline-flex items-center gap-2 bg-white/10 border border-white/20 px-3 py-2">
                <Users size={16} className="text-orange-400" />
                Ages 8–25
              </span>
              <span className="inline-flex items-center gap-2 bg-white/10 border border-white/20 px-3 py-2">
                <Trophy size={16} className="text-orange-400" />
                Camp + Tournament
              </span>
              <span className="inline-flex items-center gap-2 bg-white/10 border border-white/20 px-3 py-2">
                <Banknote size={16} className="text-orange-400" />
                ₦1,000 registration
              </span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-5 gap-12 items-start">
          <div className="lg:col-span-2 space-y-6">
            <div>
              <span className="text-orange-500 font-semibold text-sm uppercase tracking-widest">Register Now</span>
              <h3 className="text-3xl font-black text-gray-900 mt-2 mb-3 leading-tight">
                Secure your spot on the court
              </h3>
              <p className="text-gray-500 leading-relaxed">
                Training, scrimmages, and a closing tournament with certified coaching.
                Boys and girls welcome. Under-18s need a parent or guardian listed.
              </p>
            </div>
            <div className="flex items-start gap-3 bg-orange-50 border border-orange-100 px-4 py-3">
              <Banknote size={18} className="text-orange-500 mt-0.5 shrink-0" />
              <p className="text-sm text-gray-800">
                <span className="font-bold">Registration fee: ₦1,000</span>
                <span className="text-gray-500"> per participant, paid securely via Paystack.</span>
              </p>
            </div>
            <ul className="space-y-3 text-sm text-gray-700">
              {[
                'Skills clinics: shooting, defence, footwork, and game IQ',
                'Daily scrimmages grouped by age',
                'End-of-camp 3-on-3 / 5-on-5 tournament',
                'Bring outdoor basketball shoes and water',
              ].map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="mt-1.5 w-1.5 h-1.5 bg-orange-500 rounded-full shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="text-gray-400 text-xs leading-relaxed">
              Venue: Kusuv Village, Buruku LGA, Benue State. Further kit and schedule
              details will be sent to your email after registration.
            </p>
          </div>

          <div className="lg:col-span-3 bg-gray-50 shadow-sm p-6 sm:p-10">
            {success ? (
              <div className="flex flex-col items-center justify-center py-12 text-center gap-4">
                <CheckCircle size={52} className="text-emerald-500" />
                <h3 className="text-xl font-black text-gray-900">You&apos;re registered!</h3>
                <p className="text-gray-500 max-w-sm">
                  Your ₦1,000 registration fee has been received for the 26–28 December camp.
                  We&apos;ll follow up by email with confirmation and next steps.
                </p>
                <button
                  type="button"
                  onClick={() => setSuccess(false)}
                  className="mt-2 bg-orange-500 text-white font-bold px-6 py-2.5 text-sm"
                >
                  Register another player
                </button>
              </div>
            ) : (
              <form onSubmit={submit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name</label>
                    <input name="full_name" value={form.full_name} onChange={handle} required placeholder="Player's full name" className={inputClass} />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Gender</label>
                    <select name="gender" value={form.gender} onChange={handle} required className={inputClass}>
                      <option value="">Select</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Age</label>
                    <input name="age" type="number" min={8} max={25} value={form.age} onChange={handle} required placeholder="e.g. 14" className={inputClass} />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Phone</label>
                    <input name="phone" type="tel" value={form.phone} onChange={handle} required placeholder="+234..." className={inputClass} />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email</label>
                    <input name="email" type="email" value={form.email} onChange={handle} required placeholder="you@example.com" className={inputClass} />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Age Group</label>
                    <select name="age_group" value={form.age_group} onChange={handle} required className={inputClass}>
                      <option value="">Select</option>
                      <option value="u12">Under 12</option>
                      <option value="u15">13–15</option>
                      <option value="u18">16–18</option>
                      <option value="open">19–25 (Young adults)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Experience</label>
                    <select name="experience" value={form.experience} onChange={handle} required className={inputClass}>
                      <option value="">Select</option>
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Position</label>
                    <select name="position" value={form.position} onChange={handle} className={inputClass}>
                      <option value="">Any / not sure</option>
                      <option value="guard">Guard</option>
                      <option value="forward">Forward</option>
                      <option value="center">Center</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">T-shirt Size</label>
                    <select name="tshirt_size" value={form.tshirt_size} onChange={handle} required className={inputClass}>
                      <option value="">Select</option>
                      {['XS', 'S', 'M', 'L', 'XL'].map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                      {needsGuardian ? 'Parent / Guardian Name' : 'Emergency Contact Name'}
                    </label>
                    <input
                      name="guardian_name"
                      value={form.guardian_name}
                      onChange={handle}
                      required={needsGuardian}
                      placeholder={needsGuardian ? 'Parent or guardian' : 'Next of kin'}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                      {needsGuardian ? 'Parent / Guardian Phone' : 'Emergency Contact Phone'}
                    </label>
                    <input
                      name="guardian_phone"
                      type="tel"
                      value={form.guardian_phone}
                      onChange={handle}
                      required={needsGuardian}
                      placeholder="+234..."
                      className={inputClass}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Medical notes (optional)</label>
                    <textarea
                      name="medical_notes"
                      value={form.medical_notes}
                      onChange={handle}
                      rows={3}
                      placeholder="Allergies, injuries, or anything coaches should know"
                      className={`${inputClass} resize-none`}
                    />
                  </div>
                </div>

                <label className="flex items-start gap-3 text-sm text-gray-600">
                  <input
                    type="checkbox"
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                    className="mt-1 accent-orange-500"
                  />
                  <span>
                    I confirm this information is accurate, the participant has permission to attend
                    the 26–28 December 2026 camp and tournament, and I understand the ₦1,000
                    registration fee.
                  </span>
                </label>

                {error && <p className="text-red-500 text-sm">{error}</p>}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-bold py-3.5 text-sm flex items-center justify-center gap-2 transition-all"
                >
                  {loading ? 'Processing payment...' : (<><ClipboardList size={16} /> Pay ₦1,000 &amp; Register</>)}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
