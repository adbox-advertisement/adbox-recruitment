import { z } from 'zod';
import { institutions } from '../../data/institutions';

const shortAnswer = (message: string) =>
  z.string().trim().min(1, message).max(200, 'Please keep this under 200 characters.');
const paragraph = (message: string) =>
  z.string().trim().min(1, message).max(1200, 'Please keep this under 1,200 characters.');

export const applicationSchema = z.object({
  fullName: shortAnswer('Enter your full name.'),
  institution: z
    .string()
    .refine((value) => institutions.some((item) => item.id === value), 'Choose your institution.'),
  programme: shortAnswer('Enter your programme and year of study.'),
  phone: z
    .string()
    .trim()
    .min(1, 'Enter your WhatsApp number.')
    .regex(/^[+\d][\d ()-]*$/, 'Use a phone number, including the country code if needed.')
    .refine((value) => {
      const digits = value.replace(/\D/g, '');
      return digits.length >= 9 && digits.length <= 15;
    }, 'Enter a valid phone number (9–15 digits).'),
  email: z
    .string()
    .trim()
    .min(1, 'Enter your email address.')
    .email('Enter a valid email address.')
    .max(254),
  campusReach: paragraph('Tell us which areas of campus you can reach.'),
  motivation: paragraph('Tell us why you would like to be a rep.'),
  experience: paragraph('Tell us about a time you brought students together.'),
  availability: shortAnswer('Tell us how many hours and which days you can give.'),
  otherRoles: z.string().trim().max(1200, 'Please keep this under 1,200 characters.'),
  phoneModel: shortAnswer('Enter your phone model and Android or iPhone.'),
  paymentAnswer: paragraph('Tell us what you would say to the student.'),
  comfortable: z
    .enum(['', 'yes', 'no'])
    .refine((value): boolean => value !== '', 'Choose Yes or No.'),
  honesty: z
    .boolean()
    .refine((value) => value, 'Please agree to honest reporting before continuing.'),
});

export type ApplicationValues = z.infer<typeof applicationSchema>;
export type FieldName = keyof ApplicationValues;

export const defaultValues: ApplicationValues = {
  fullName: '',
  institution: '',
  programme: '',
  phone: '',
  email: '',
  campusReach: '',
  motivation: '',
  experience: '',
  availability: '',
  otherRoles: '',
  phoneModel: '',
  paymentAnswer: '',
  comfortable: '',
  honesty: false,
};
