import type { FieldName } from './schema';

export interface Question {
  name: FieldName;
  label: string;
  hint?: string;
  placeholder?: string;
  type: 'text' | 'email' | 'tel' | 'textarea' | 'select' | 'radio' | 'checkbox';
  optional?: boolean;
  autoComplete?: string;
}

export const questions: Question[] = [
  {
    name: 'fullName',
    label: 'Full name',
    type: 'text',
    autoComplete: 'name',
    placeholder: 'Your first and last name',
  },
  { name: 'institution', label: 'Which institution do you attend?', type: 'select' },
  {
    name: 'programme',
    label: 'Programme and year of study',
    type: 'text',
    placeholder: 'e.g. BSc Computer Science, Year 3',
  },
  {
    name: 'phone',
    label: 'Phone number (WhatsApp)',
    type: 'tel',
    autoComplete: 'tel',
    placeholder: 'e.g. 050 123 4567',
    hint: 'Use a number we can reach you on.',
  },
  {
    name: 'email',
    label: 'Email address',
    type: 'email',
    autoComplete: 'email',
    placeholder: 'you@example.com',
  },
  {
    name: 'campusReach',
    label: 'Which halls, hostels or areas of campus can you reach easily?',
    type: 'textarea',
    hint: 'A few names are enough.',
    placeholder: 'Halls, hostels, departments or nearby areas…',
  },
  {
    name: 'motivation',
    label: 'Why do you want to do this?',
    type: 'textarea',
    hint: 'Two or three sentences, in your own words.',
    placeholder: 'Tell us what interests you about being an Adbox rep…',
  },
  {
    name: 'experience',
    label:
      'Tell us about a time you got a group of students to do something — a club, an event, a class project, a hall activity.',
    type: 'textarea',
    hint: 'What did you organise, and how did you get people involved?',
    placeholder: 'It can be something small. We want to hear your story…',
  },
  {
    name: 'availability',
    label: 'How many hours a week can you genuinely give, and on which days?',
    type: 'text',
    placeholder: 'e.g. 3 hours a week, Tuesdays and Saturdays',
    hint: 'Be realistic. Your studies come first.',
  },
  {
    name: 'otherRoles',
    label: 'Are you already an executive or rep for another group, brand or app?',
    type: 'textarea',
    optional: true,
    hint: 'If yes, tell us which group and what you do. This does not rule you out.',
    placeholder: 'You can leave this blank if it does not apply.',
  },
  {
    name: 'phoneModel',
    label: 'What phone do you use, and is it Android or iPhone?',
    type: 'text',
    placeholder: 'e.g. Samsung Galaxy A15, Android',
  },
  {
    name: 'paymentAnswer',
    label: 'A student asks “will I get paid for using this?” — what do you say?',
    type: 'textarea',
    hint: 'Write the answer you would give them, in your own words.',
    placeholder: 'I would say…',
  },
  {
    name: 'comfortable',
    label: 'Are you comfortable approaching students you do not know, in person?',
    type: 'radio',
  },
  {
    name: 'honesty',
    label:
      'Do you agree to report numbers honestly, and never to create accounts for people who are not present?',
    type: 'checkbox',
    hint: 'I agree to report honestly and only help students who are present create their own accounts.',
  },
];

export const steps = [
  {
    title: 'Your details',
    description: 'Let’s get to know you.',
    caption: 'A few basics so we know who you are and how to reach you.',
    fields: questions.slice(0, 5).map((question) => question.name),
  },
  {
    title: 'Campus life',
    description: 'You know your campus best.',
    caption: 'Tell us where you connect and how you bring people together.',
    fields: questions.slice(5, 8).map((question) => question.name),
  },
  {
    title: 'The role',
    description: 'Let’s find your fit.',
    caption: 'Be yourself. Honest answers help us build the right team.',
    fields: questions.slice(8, 14).map((question) => question.name),
  },
  {
    title: 'Your video',
    description: 'Put a face to your application.',
    caption: 'A short introduction, in your own voice. No editing needed.',
    fields: [],
  },
  {
    title: 'Review',
    description: 'One last look.',
    caption: 'Check your answers and video before you send your application.',
    fields: [],
  },
] as const;
