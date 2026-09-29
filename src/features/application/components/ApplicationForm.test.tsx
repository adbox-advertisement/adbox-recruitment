import { StrictMode } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, it } from 'vitest';
import { ApplicationForm } from './ApplicationForm';

it('prevents empty progress, focuses the first invalid field and has 22 real campus options', async () => {
  const user = userEvent.setup();
  render(
    <StrictMode>
      <ApplicationForm />
    </StrictMode>,
  );
  expect(screen.getAllByRole('option')).toHaveLength(23);
  await user.click(screen.getByRole('button', { name: 'Continue' }));
  expect(await screen.findByText('Enter your full name.')).toBeVisible();
  expect(screen.getByLabelText(/Full name/)).toHaveFocus();
  expect(screen.getByRole('button', { name: 'Step 2: Campus life' })).toBeDisabled();
});

it('retains the selected institution when validation rerenders the field', async () => {
  const user = userEvent.setup();
  Element.prototype.scrollIntoView = () => {};
  render(
    <StrictMode>
      <ApplicationForm />
    </StrictMode>,
  );
  await user.click(screen.getByRole('button', { name: 'Continue' }));
  await user.type(screen.getByLabelText(/Full name/), 'Ama Sample');
  await user.selectOptions(screen.getByRole('combobox'), 'ug');
  await user.type(screen.getByLabelText(/Programme and year/), 'Economics, Year 3');
  await user.type(screen.getByLabelText(/Phone number/), '050 123 4567');
  await user.type(screen.getByLabelText(/Email address/), 'ama@example.com');
  await user.click(screen.getByRole('button', { name: 'Continue' }));
  expect(await screen.findByRole('heading', { name: 'You know your campus best.' })).toBeVisible();
});
