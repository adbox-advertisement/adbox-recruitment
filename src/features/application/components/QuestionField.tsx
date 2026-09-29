import { Controller, useFormContext } from 'react-hook-form';
import { institutions, regions } from '../../../data/institutions';
import type { ApplicationValues } from '../schema';
import type { Question } from '../questions';

export function QuestionField({ question, number }: { question: Question; number: number }) {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<ApplicationValues>();
  const { name, label, type, hint, optional, placeholder, autoComplete } = question;
  const error = errors[name]?.message;
  const id = 'field-' + name;
  const description =
    [hint && id + '-hint', error && id + '-error'].filter(Boolean).join(' ') || undefined;
  const shared = {
    id,
    'aria-invalid': !!error,
    'aria-describedby': description,
    'aria-required': !optional,
  };
  const heading = (
    <>
      <span className="question-number">{String(number).padStart(2, '0')}</span>
      <span>
        {label}
        {optional && <span className="optional">Optional</span>}
      </span>
    </>
  );
  const help = (
    <>
      {hint && (
        <p className="field-hint" id={id + '-hint'}>
          {hint}
        </p>
      )}
      {error && (
        <p className="field-error" id={id + '-error'} role="alert">
          {error}
        </p>
      )}
    </>
  );

  if (type === 'radio')
    return (
      <fieldset className="field" aria-describedby={description} aria-invalid={!!error}>
        <legend className="field-label">{heading}</legend>
        <div className="radio-options">
          {(['yes', 'no'] as const).map((value) => (
            <label className="radio-option" key={value}>
              <input
                type="radio"
                value={value}
                {...register(name)}
                {...(value === 'yes' ? { id } : {})}
                aria-describedby={description}
                aria-required="true"
              />
              {value === 'yes' ? 'Yes, I am' : 'No, not yet'}
            </label>
          ))}
        </div>
        {help}
      </fieldset>
    );
  if (type === 'checkbox')
    return (
      <div className="field">
        <p className="field-label" id={id + '-question'}>
          {heading}
        </p>
        <label className="checkbox-option">
          <input
            type="checkbox"
            {...register(name)}
            {...shared}
            aria-labelledby={id + '-question ' + id + '-hint'}
          />
          <span id={id + '-hint'}>{hint}</span>
        </label>
        {error && (
          <p className="field-error" id={id + '-error'} role="alert">
            {error}
          </p>
        )}
      </div>
    );
  return (
    <div className="field">
      <label className="field-label" htmlFor={id}>
        {heading}
      </label>
      {type === 'select' ? (
        <Controller
          name={name}
          control={control}
          render={({ field }) => (
            <select {...field} {...shared} value={String(field.value)}>
              <option value="" disabled>
                Select your institution
              </option>
              {regions.map((region) => (
                <optgroup label={region} key={region}>
                  {institutions
                    .filter((institution) => institution.region === region)
                    .map((institution) => (
                      <option value={institution.id} key={institution.id}>
                        {institution.name}
                      </option>
                    ))}
                </optgroup>
              ))}
            </select>
          )}
        />
      ) : type === 'textarea' ? (
        <textarea
          {...register(name)}
          {...shared}
          placeholder={placeholder}
          maxLength={1200}
          rows={3}
        />
      ) : (
        <input
          {...register(name)}
          {...shared}
          type={type}
          placeholder={placeholder}
          autoComplete={autoComplete ?? 'off'}
          maxLength={type === 'email' ? 254 : 200}
          inputMode={type === 'tel' ? 'tel' : undefined}
        />
      )}
      {help}
    </div>
  );
}
