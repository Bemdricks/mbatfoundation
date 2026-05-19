import { useState } from 'react';
import { X, Heart, CheckCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface DonateModalProps {
  open: boolean;
  onClose: () => void;
}

const amounts = [10, 25, 50, 100, 250];

export default function DonateModal({ open, onClose }: DonateModalProps) {
  const [selected, setSelected] = useState<number | null>(50);
  const [custom, setCustom] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const finalAmount = custom ? parseFloat(custom) : selected;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!finalAmount || finalAmount <= 0) { setError('Please select or enter a valid amount.'); return; }
    setLoading(true);
    setError('');
    const { error: err } = await supabase.from('donations').insert([{ name, email, amount: finalAmount }]);
    setLoading(false);
    if (err) { setError('Something went wrong. Please try again.'); return; }
    setSuccess(true);
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setSuccess(false);
      setSelected(50);
      setCustom('');
      setName('');
      setEmail('');
      setError('');
    }, 300);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gray-900/70 backdrop-blur-sm" onClick={handleClose} />
      <div className="relative bg-white  shadow-2xl w-full max-w-md overflow-hidden animate-in">
        <div className="bg-gray-900 px-8 pt-8 pb-6">
          <button
            onClick={handleClose}
            className="absolute top-5 right-5 w-8 h-8 bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors"
          >
            <X size={16} />
          </button>
          <div className="flex items-center gap-3 mb-2">
            <Heart size={22} className="text-white fill-white" />
            <h2 className="text-2xl font-black text-white">Make a Donation</h2>
          </div>
          <p className="text-orange-100 text-sm">Your generosity changes a child's future</p>
        </div>

        <div className="px-8 py-7">
          {success ? (
            <div className="flex flex-col items-center text-center py-8 gap-4">
              <CheckCircle size={52} className="text-emerald-500" />
              <h3 className="text-xl font-black text-gray-900">Thank You!</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Your donation of <strong>${finalAmount}</strong> has been recorded. We are deeply grateful for your support.
              </p>
              <button
                onClick={handleClose}
                className="mt-2 bg-orange-500 text-white font-bold px-8 py-3 text-sm"
              >
                Close
              </button>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Select Amount (USD)</label>
                <div className="grid grid-cols-5 gap-2 mb-3">
                  {amounts.map((a) => (
                    <button
                      key={a}
                      type="button"
                      onClick={() => { setSelected(a); setCustom(''); }}
                      className={`py-2.5 text-sm font-bold border-2 transition-all ${
                        selected === a && !custom
                          ? 'bg-orange-500 border-orange-500 text-white'
                          : 'border-gray-200 text-gray-700 hover:border-orange-300'
                      }`}
                    >
                      ${a}
                    </button>
                  ))}
                </div>
                <input
                  type="number"
                  placeholder="Custom amount"
                  value={custom}
                  onChange={(e) => { setCustom(e.target.value); setSelected(null); }}
                  className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Your Name</label>
                <input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Full name"
                  className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address</label>
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                />
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-black py-4 text-base flex items-center justify-center gap-2 transition-all shadow-lg shadow-orange-200"
              >
                <Heart size={18} className="fill-white" />
                {loading ? 'Processing...' : `Donate $${finalAmount || '—'}`}
              </button>
              <p className="text-gray-400 text-xs text-center">
                Secure donation. MBAT Development Foundation is a registered NGO.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
