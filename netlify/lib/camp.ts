export const CAMP_EVENT = 'dec_2026_camp';
export const CAMP_FEE_NGN = 1000;
export const CAMP_FEE_KOBO = CAMP_FEE_NGN * 100;

export const GENDERS = ['male', 'female'] as const;
export const AGE_GROUPS = ['u12', 'u15', 'u18', 'open'] as const;
export const EXPERIENCE = ['beginner', 'intermediate', 'advanced'] as const;
export const POSITIONS = ['', 'guard', 'forward', 'center'] as const;
export const TSHIRT_SIZES = ['XS', 'S', 'M', 'L', 'XL'] as const;

export type CampRegistrationInput = {
  full_name: string;
  gender: string;
  age: number | string;
  phone: string;
  email: string;
  age_group: string;
  position?: string;
  experience: string;
  guardian_name?: string;
  guardian_phone?: string;
  tshirt_size: string;
  medical_notes?: string;
};

function includes(list: readonly string[], value: string) {
  return list.includes(value);
}

export function validateCampRegistration(input: CampRegistrationInput): string | null {
  const fullName = input.full_name?.trim() || '';
  const email = input.email?.trim() || '';
  const phone = input.phone?.trim() || '';
  const age = typeof input.age === 'number' ? input.age : parseInt(String(input.age), 10);

  if (!fullName || !email || !phone) return 'Missing required fields';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Enter a valid email address';
  if (Number.isNaN(age) || age < 8 || age > 25) return 'Participants must be between 8 and 25 years old.';
  if (!includes(GENDERS, input.gender)) return 'Select a valid gender';
  if (!includes(AGE_GROUPS, input.age_group)) return 'Select a valid age group';
  if (!includes(EXPERIENCE, input.experience)) return 'Select a valid experience level';
  if (!includes(TSHIRT_SIZES, input.tshirt_size)) return 'Select a valid t-shirt size';
  if (input.position && !includes(POSITIONS, input.position)) return 'Select a valid position';
  if (age < 18 && (!input.guardian_name?.trim() || !input.guardian_phone?.trim())) {
    return 'Parent or guardian name and phone are required for participants under 18.';
  }
  return null;
}

export function campRow(input: CampRegistrationInput, reference: string) {
  const age = typeof input.age === 'number' ? input.age : parseInt(String(input.age), 10);
  return {
    event: CAMP_EVENT,
    full_name: input.full_name.trim(),
    gender: input.gender,
    age,
    phone: input.phone.trim(),
    email: input.email.trim(),
    age_group: input.age_group,
    position: input.position?.trim() || '',
    experience: input.experience,
    guardian_name: input.guardian_name?.trim() || '',
    guardian_phone: input.guardian_phone?.trim() || '',
    tshirt_size: input.tshirt_size,
    medical_notes: input.medical_notes?.trim() || '',
    fee_amount: CAMP_FEE_NGN,
    currency: 'NGN',
    paystack_reference: reference,
    payment_status: 'pending',
  };
}
