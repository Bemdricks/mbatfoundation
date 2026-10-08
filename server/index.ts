import { existsSync } from 'node:fs';
import cors from 'cors';
import express, { type Request, type Response } from 'express';

if (existsSync('.env')) {
  process.loadEnvFile('.env');
}
import {
  CAMP_EVENT,
  CAMP_FEE_KOBO,
  CAMP_FEE_NGN,
  campDocument,
  validateCampRegistration,
  type CampRegistrationInput,
} from './camp';
import { connectDb } from './db';
import { CampRegistration, ContactMessage, Donation } from './models';
import { recordSuccessfulCampPayment, recordSuccessfulDonation } from './payments';
import {
  initializeTransaction,
  isSuccessfulCharge,
  newReference,
  paymentKind,
  signatureIsValid,
  verifyTransaction,
  type PaystackTransaction,
} from './paystack';

const CURRENCY_SYMBOLS: Record<string, string> = { NGN: '₦', USD: '$', GBP: '£', EUR: '€' };
const MIN_AMOUNTS: Record<string, number> = { NGN: 100, USD: 1, GBP: 1, EUR: 1 };
const SUBJECTS = [
  'Donation Inquiry',
  'Basketball Camp',
  'Volunteer Application',
  'Partnership Opportunity',
  'Program Information',
  'Media & Press',
  'Other',
];

function fail(res: Response, status: number, error: string) {
  return res.status(status).json({ error });
}

const router = express.Router();

router.get('/health', (_req, res) => {
  res.json({ ok: true });
});

router.post('/initialize-donation', async (req, res) => {
  try {
    const { email, amount, currency, name } = req.body as {
      email?: string;
      amount?: number | string;
      currency?: string;
      name?: string;
    };

    if (!email || !name || !amount || !currency) {
      return fail(res, 400, 'Missing required fields');
    }
    if (!['NGN', 'USD', 'GBP', 'EUR'].includes(currency)) {
      return fail(res, 400, 'Currency must be NGN, USD, GBP, or EUR');
    }

    const parsedAmount = parseFloat(String(amount));
    const minAmount = MIN_AMOUNTS[currency];
    if (Number.isNaN(parsedAmount) || parsedAmount < minAmount) {
      return fail(res, 400, `Minimum donation is ${CURRENCY_SYMBOLS[currency]}${minAmount}`);
    }

    const reference = newReference('mbat_don');
    await Donation.create({
      name: name.trim(),
      email: email.trim(),
      amount: parsedAmount,
      currency,
      paystack_reference: reference,
      status: 'pending',
    });

    const data = await initializeTransaction({
      email: email.trim(),
      amount: Math.round(parsedAmount * 100),
      currency,
      reference,
      metadata: {
        type: 'donation',
        donor_name: name.trim(),
        custom_fields: [
          { display_name: 'Donor Name', variable_name: 'donor_name', value: name.trim() },
        ],
      },
    });

    if (!data.status || !data.data) {
      await Donation.updateOne({ paystack_reference: reference }, { status: 'failed' });
      return fail(res, 400, data.message || 'Failed to initialize payment');
    }

    return res.json({
      access_code: data.data.access_code,
      reference: data.data.reference,
    });
  } catch (err) {
    console.error(err);
    return fail(res, 500, 'Internal server error');
  }
});

router.post('/verify-donation', async (req, res) => {
  try {
    const { reference } = req.body as { reference?: string };
    if (!reference) return fail(res, 400, 'Missing payment reference');

    const verified = await verifyTransaction(reference);
    if (!verified.status || !isSuccessfulCharge(verified.data)) {
      return fail(res, 400, 'Payment not completed');
    }

    const recorded = await recordSuccessfulDonation(verified.data!);
    return res.json({ verified: true, ...recorded });
  } catch (err) {
    console.error(err);
    return fail(res, 500, 'Internal server error');
  }
});

router.post('/initialize-camp-registration', async (req, res) => {
  try {
    const body = req.body as CampRegistrationInput;
    const validationError = validateCampRegistration(body);
    if (validationError) return fail(res, 400, validationError);

    const reference = newReference('mbat_camp');
    const doc = campDocument(body, reference);
    const inserted = await CampRegistration.create(doc);

    const data = await initializeTransaction({
      email: doc.email,
      amount: CAMP_FEE_KOBO,
      currency: 'NGN',
      reference,
      metadata: {
        type: 'camp_registration',
        event: CAMP_EVENT,
        registration_id: String(inserted._id),
        participant_name: doc.full_name,
        custom_fields: [
          { display_name: 'Participant', variable_name: 'participant_name', value: doc.full_name },
          { display_name: 'Camp fee', variable_name: 'camp_fee', value: `NGN ${CAMP_FEE_NGN}` },
        ],
      },
    });

    if (!data.status || !data.data) {
      await CampRegistration.deleteOne({ _id: inserted._id });
      return fail(res, 400, data.message || 'Failed to initialize payment');
    }

    return res.json({
      access_code: data.data.access_code,
      reference: data.data.reference,
      amount: CAMP_FEE_NGN,
      currency: 'NGN',
    });
  } catch (err) {
    console.error(err);
    return fail(res, 500, 'Internal server error');
  }
});

router.post('/verify-camp-registration', async (req, res) => {
  try {
    const { reference } = req.body as { reference?: string };
    if (!reference) return fail(res, 400, 'Missing payment reference');

    const verified = await verifyTransaction(reference);
    if (!verified.status || !isSuccessfulCharge(verified.data)) {
      return fail(res, 400, 'Payment not completed');
    }

    const recorded = await recordSuccessfulCampPayment(verified.data!);
    return res.json({ verified: true, ...recorded });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Internal server error';
    if (message === 'Camp registration not found' || message === 'Camp fee amount mismatch') {
      return fail(res, 400, message);
    }
    console.error(err);
    return fail(res, 500, 'Internal server error');
  }
});

router.post('/submit-contact', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body as {
      name?: string;
      email?: string;
      subject?: string;
      message?: string;
    };
    const trimmed = {
      name: name?.trim() || '',
      email: email?.trim() || '',
      subject: subject?.trim() || '',
      message: message?.trim() || '',
    };

    if (!trimmed.name || !trimmed.email || !trimmed.subject || !trimmed.message) {
      return fail(res, 400, 'Missing required fields');
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed.email)) {
      return fail(res, 400, 'Enter a valid email address');
    }
    if (!SUBJECTS.includes(trimmed.subject)) {
      return fail(res, 400, 'Select a valid subject');
    }
    if (trimmed.message.length > 5000) {
      return fail(res, 400, 'Message is too long');
    }

    await ContactMessage.create(trimmed);
    return res.json({ ok: true });
  } catch (err) {
    console.error(err);
    return fail(res, 500, 'Internal server error');
  }
});

async function handlePaystackWebhook(req: Request, res: Response) {
  const raw = Buffer.isBuffer(req.body)
    ? req.body.toString('utf8')
    : typeof req.body === 'string'
      ? req.body
      : JSON.stringify(req.body ?? {});
  const signature = req.header('x-paystack-signature');

  try {
    if (!signatureIsValid(raw, signature)) {
      return fail(res, 401, 'Invalid signature');
    }

    const payload = JSON.parse(raw) as { event?: string; data?: PaystackTransaction };
    if (payload.event !== 'charge.success' || !isSuccessfulCharge(payload.data)) {
      return res.json({ received: true });
    }

    const tx = payload.data!;
    const kind = paymentKind(tx);
    if (kind === 'camp_registration') {
      await recordSuccessfulCampPayment(tx);
    } else if (kind === 'donation') {
      await recordSuccessfulDonation(tx);
    }

    return res.json({ received: true });
  } catch (err) {
    console.error(err);
    return fail(res, 500, 'Webhook processing failed');
  }
}

const app = express();
const origin = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map((value) => value.trim()).filter(Boolean)
  : true;

app.use(cors({ origin, methods: ['GET', 'POST', 'OPTIONS'] }));
app.options('*', cors({ origin }));

const webhookPaths = ['/paystack-webhook', '/api/paystack-webhook'];
app.use((req, res, next) => {
  if (webhookPaths.includes(req.path)) {
    return express.raw({ type: '*/*' })(req, res, next);
  }
  return express.json({ limit: '1mb' })(req, res, next);
});

app.post('/paystack-webhook', handlePaystackWebhook);
app.post('/api/paystack-webhook', handlePaystackWebhook);
app.use('/api', router);
app.use('/', router);

const port = Number(process.env.PORT) || 4000;

connectDb()
  .then(() => {
    app.listen(port, () => {
      console.log(`MBAT API listening on port ${port}`);
    });
  })
  .catch((err) => {
    console.error('Failed to start API', err);
    process.exit(1);
  });
