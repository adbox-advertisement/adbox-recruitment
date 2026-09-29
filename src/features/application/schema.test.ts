import { describe, expect, it } from 'vitest';
import { applicationSchema, defaultValues } from './schema';
import { institutions } from '../../data/institutions';
import { questions, steps } from './questions';

import { validAnswers } from '../../test/fixtures';

describe('application contract', () => {
  it('accepts an honest No and an empty optional existing-role answer', () => {
    expect(applicationSchema.safeParse(validAnswers).success).toBe(true);
  });
  it('requires every question except otherRoles', () => {
    for (const name of Object.keys(defaultValues) as (keyof typeof defaultValues)[]) {
      if (name === 'otherRoles') continue;
      expect(
        applicationSchema.safeParse({ ...validAnswers, [name]: defaultValues[name] }).success,
        name,
      ).toBe(false);
    }
  });
  it('rejects whitespace, invalid email, invalid phone and unlisted institutions', () => {
    for (const invalid of [
      { fullName: '   ' },
      { email: 'not-an-email' },
      { phone: 'call me' },
      { phone: '123' },
      { institution: 'Knust' },
    ]) {
      expect(applicationSchema.safeParse({ ...validAnswers, ...invalid }).success).toBe(false);
    }
  });
  it('trims answers and caps paragraphs', () => {
    expect(applicationSchema.parse({ ...validAnswers, fullName: ' Ama Sample ' }).fullName).toBe(
      'Ama Sample',
    );
    expect(
      applicationSchema.safeParse({ ...validAnswers, experience: 'a'.repeat(1201) }).success,
    ).toBe(false);
  });
  it('keeps the requested fourteen questions in order across the steps', () => {
    const expected = [
      'fullName',
      'institution',
      'programme',
      'phone',
      'email',
      'campusReach',
      'motivation',
      'experience',
      'availability',
      'otherRoles',
      'phoneModel',
      'paymentAnswer',
      'comfortable',
      'honesty',
    ];
    expect(questions.map((question) => question.name)).toEqual(expected);
    expect(steps.flatMap((step) => [...step.fields])).toEqual(expected);
    expect(
      questions.filter((question) => question.optional).map((question) => question.name),
    ).toEqual(['otherRoles']);
  });
  it('offers exactly 22 distinct institutions with canonical spelling', () => {
    expect(institutions).toHaveLength(22);
    expect(new Set(institutions.map((item) => item.id)).size).toBe(22);
    expect(institutions.map((item) => item.name)).toEqual([
      'University of Ghana',
      'UPSA',
      'GIMPA',
      'Accra Technical University',
      'Central University',
      'Valley View',
      'KNUST',
      'Kumasi Technical University',
      'University of Cape Coast',
      'UEW',
      'Cape Coast Technical University',
      'Ashesi University',
      'Koforidua Technical University',
      'Takoradi Technical University',
      'UMaT',
      'Ho Technical University',
      'UHAS',
      'UDS',
      'Tamale Technical University',
      'UENR',
      'Sunyani Technical University',
      'Bolgatanga Technical University',
    ]);
  });
});
