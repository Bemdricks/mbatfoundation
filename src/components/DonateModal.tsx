import { useState } from 'react';
import PaystackPop from '@paystack/inline-js';
import { X, Heart, CheckCircle } from 'lucide-react';
import { initializeDonation, verifyDonation, type Currency } from '../lib/api';

interface DonateModalProps {
  open: boolean;
  onClose: () => void;
}

const CURRENCIES: { code: Currency; label: string; symbol: string }[] = [
  { code: 'NGN', label: '₦ NGN', symbol: '₦' },
  { code: 'USD', label: '$ USD', symbol: '$' },
  { code: 'GBP', label: '£ GBP', symbol: '£' },
  { code: 'EUR', label: '€ EUR', symbol: '€' },
];

const PRESETS: Record<Currency, number[]> = {
  NGN: [5000, 10000, 25000, 50000, 100000],
  USD: [10, 25, 50, 100, 250],
  GBP: [10, 25, 50, 100, 250],
  EUR: [10, 25, 50, 100, 250],
};

function currencyMeta(currency: Currency) {
  return CURRENCIES.find((c) => c.code === currency)!;
}

function formatAmount(amount: number, currency: Currency) {
  return `${currencyMeta(currency).symbol}${amount.toLocaleString()}`;
}

function formatPreset(amount: number, currency: Currency) {
  const symbol = currencyMeta(currency).symbol;
  if (currency === 'NGN') return `${symbol}${(amount / 1000).toFixed(0)}k`;
  return `${symbol}${amount}`;
}

export default function DonateModal({ open, onClose }: DonateModalProps) {
  const [currency, setCurrency] = useState<Currency>('NGN');
  const [selected, setSelected] = useState<number | null>(10000);
  const [custom, setCustom] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [confirmedAmount, setConfirmedAmount] = useState<number | null>(null);
  const [confirmedCurrency, setConfirmedCurrency] = useState<Currency>('NGN');
  const [error, setError] = useState('');

  const finalAmount = custom ? parseFloat(custom) : selected;
  const amounts = PRESETS[currency];

  const switchCurrency = (next: Currency) => {
    setCurrency(next);
    setSelected(PRESETS[next][2]);
    setCustom('');
    setError('');
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!finalAmount || finalAmount <= 0) {
      setError('Please select or enter a valid amount.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { access_code, reference } = await initializeDonation({
        email,
        amount: finalAmount,
        currency,
        name,
      });

      const paystack = new PaystackPop();

      paystack.resumeTransaction(access_code, {
        onSuccess: async (transaction) => {
          try {
            const result = await verifyDonation(transaction.reference || reference);
            setConfirmedAmount(result.amount ?? finalAmount);
            setConfirmedCurrency((result.currency as Currency) ?? currency);
            setSuccess(true);
          } catch {
            setError('Payment received but verification failed. Please contact us with your reference.');
          } finally {
            setLoading(false);
          }
        },
        onCancel: () => {
          setLoading(false);
          setError('Payment cancelled.');
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

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setSuccess(false);
      setCurrency('NGN');
      setSelected(10000);
      setCustom('');
      setName('');
      setEmail('');
      setConfirmedAmount(null);
      setError('');
    }, 300);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4">
      <div className="absolute inset-0 bg-gray-900/70 backdrop-blur-sm" onClick={handleClose} />
      <div className="relative bg-white shadow-2xl w-full max-w-md max-h-[calc(100dvh-1.5rem)] sm:max-h-[calc(100dvh-2rem)] flex flex-col overflow-hidden animate-in">
        <div className="bg-gray-900 px-6 sm:px-8 pt-5 sm:pt-6 pb-4 shrink-0">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 w-8 h-8 bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors"
          >
            <X size={16} />
          </button>
          <div className="flex items-center gap-3 mb-1">
            <Heart size={20} className="text-white fill-white" />
            <h2 className="text-xl sm:text-2xl font-black text-white">Make a Donation</h2>
          </div>
          <p className="text-orange-100 text-sm">Your generosity changes a child's future</p>
        </div>

        <div className="px-6 sm:px-8 py-5 overflow-y-auto overscroll-contain">
          {success ? (
            <div className="flex flex-col items-center text-center py-6 gap-4">
              <CheckCircle size={52} className="text-emerald-500" />
              <h3 className="text-xl font-black text-gray-900">Thank You!</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Your donation of{' '}
                <strong>{formatAmount(confirmedAmount ?? finalAmount ?? 0, confirmedCurrency)}</strong>{' '}
                has been received. We are deeply grateful for your support.
              </p>
              <button
                onClick={handleClose}
                className="mt-2 bg-orange-500 text-white font-bold px-8 py-3 text-sm"
              >
                Close
              </button>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Currency</label>
                <div className="grid grid-cols-4 gap-2">
                  {CURRENCIES.map((c) => (
                    <button
                      key={c.code}
                      type="button"
                      onClick={() => switchCurrency(c.code)}
                      className={`py-2 text-xs sm:text-sm font-bold border-2 transition-all ${
                        currency === c.code
                          ? 'bg-orange-500 border-orange-500 text-white'
                          : 'border-gray-200 text-gray-700 hover:border-orange-300'
                      }`}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Select Amount ({currency})
                </label>
                <div className="grid grid-cols-5 gap-2 mb-2">
                  {amounts.map((a) => (
                    <button
                      key={a}
                      type="button"
                      onClick={() => { setSelected(a); setCustom(''); }}
                      className={`py-2 text-xs font-bold border-2 transition-all ${
                        selected === a && !custom
                          ? 'bg-orange-500 border-orange-500 text-white'
                          : 'border-gray-200 text-gray-700 hover:border-orange-300'
                      }`}
                    >
                      {formatPreset(a, currency)}
                    </button>
                  ))}
                </div>
                <input
                  type="number"
                  placeholder={`Custom amount (${currency})`}
                  value={custom}
                  onChange={(e) => { setCustom(e.target.value); setSelected(null); }}
                  className="w-full border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Your Name</label>
                <input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Full name"
                  className="w-full border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
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
                  className="w-full border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                />
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-black py-3.5 text-base flex items-center justify-center gap-2 transition-all shadow-lg shadow-orange-200"
              >
                <Heart size={18} className="fill-white" />
                {loading ? 'Processing...' : `Donate ${finalAmount ? formatAmount(finalAmount, currency) : '—'}`}
              </button>

              <p className="text-gray-400 text-xs text-center">
                Secure payment via Paystack. MBAT Development Foundation is a registered NGO.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
