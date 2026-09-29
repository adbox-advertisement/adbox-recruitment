import { useEffect, useRef, useState } from 'react';
import { FormProvider, useForm, type FieldErrors } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCheck,
  CircleAlert,
  LoaderCircle,
  Mail,
  ShieldCheck,
} from 'lucide-react';
import { env } from '../../../config/env';
import { applicationSchema, defaultValues, type ApplicationValues } from '../schema';
import { questions, steps } from '../questions';
import { QuestionField } from './QuestionField';
import { VideoUpload } from './VideoUpload';
import { Review } from './Review';
import { submitApplication, type ApplicationReceipt } from '../../../services/api';
import type { ApplicationVideo } from '../lib/video';

export function ApplicationForm() {
  const form = useForm<ApplicationValues>({
    defaultValues,
    resolver: zodResolver(applicationSchema),
    mode: 'onChange',
    shouldUnregister: false,
  });
  const [step, setStep] = useState(0);
  const [furthestStep, setFurthestStep] = useState(0);
  const [video, setVideo] = useState<ApplicationVideo | null>(null);
  const [videoError, setVideoError] = useState('');
  const [videoBusy, setVideoBusy] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [receipt, setReceipt] = useState<ApplicationReceipt | null>(null);
  const [sending, setSending] = useState(false);
  const requestKey = useRef<string | null>(null);
  const requestSnapshot = useRef<string | null>(null);
  const requestVideo = useRef<File | null>(null);
  const request = useRef<AbortController | null>(null);
  const submitting = useRef(false);
  const heading = useRef<HTMLHeadingElement>(null);
  const completed = receipt !== null;
  const dirty = form.formState.isDirty || video !== null;

  useEffect(() => () => request.current?.abort(), []);
  useEffect(() => {
    if (!dirty || completed) return;
    const warn = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = '';
    };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty, completed]);

  function goTo(next: number) {
    setStep(next);
    setSubmitError('');
    window.requestAnimationFrame(() => {
      heading.current?.focus({ preventScroll: true });
      document.getElementById('apply')?.scrollIntoView({ behavior: 'instant', block: 'start' });
    });
  }
  async function next() {
    if (step < 3) {
      const valid = await form.trigger([...steps[step].fields], { shouldFocus: true });
      if (!valid) return;
    }
    if (step === 3 && !video) {
      setVideoError('Please add your introduction video before continuing.');
      document.getElementById('video-choose')?.focus();
      return;
    }
    setFurthestStep(Math.max(furthestStep, step + 1));
    goTo(step + 1);
  }
  function invalid(errors: FieldErrors<ApplicationValues>) {
    const first = questions.find((question) => errors[question.name]);
    if (!first) return;
    const invalidStep = steps.findIndex((item) => item.fields.some((name) => name === first.name));
    goTo(invalidStep);
    window.requestAnimationFrame(() => form.setFocus(first.name));
  }
  async function send(values: ApplicationValues) {
    if (submitting.current) return;
    if (!video) {
      setVideoError('Please add your introduction video.');
      goTo(3);
      return;
    }
    submitting.current = true;
    setSending(true);
    setSubmitError('');
    const snapshot = JSON.stringify(values);
    if (
      !requestKey.current ||
      requestSnapshot.current !== snapshot ||
      requestVideo.current !== video.file
    ) {
      requestKey.current = crypto.randomUUID();
      requestSnapshot.current = snapshot;
      requestVideo.current = video.file;
    }
    request.current = new AbortController();
    try {
      const result = await submitApplication(
        values,
        video,
        requestKey.current,
        request.current.signal,
      );
      setReceipt(result);
      form.reset(defaultValues);
      setVideo(null);
      requestSnapshot.current = null;
      requestVideo.current = null;
      requestKey.current = null;
      window.requestAnimationFrame(() => {
        document.getElementById('application-result')?.focus({ preventScroll: true });
        document.getElementById('apply')?.scrollIntoView({ behavior: 'instant' });
      });
    } catch (caught) {
      setSubmitError(caught instanceof Error ? caught.message : 'Please try again.');
    } finally {
      setSending(false);
      submitting.current = false;
    }
  }

  if (receipt)
    return (
      <div className="application-card success-card">
        <span className="success-icon">
          <CheckCheck size={34} />
        </span>
        <span className="eyebrow">
          {receipt.mode === 'mock' ? 'PREVIEW COMPLETE' : 'APPLICATION RECEIVED'}
        </span>
        <h2 id="application-result" tabIndex={-1}>
          {receipt.mode === 'mock'
            ? 'You’ve tried the full application.'
            : 'You’re one step closer.'}
        </h2>
        <p>
          {receipt.mode === 'mock'
            ? 'This was a preview. Your application and video have not been sent or saved by Adbox.'
            : 'Thank you for putting yourself forward. The Adbox recruitment team will review your application and contact shortlisted applicants.'}
        </p>
        <div className="receipt">
          <span>{receipt.mode === 'mock' ? 'Preview reference' : 'Application reference'}</span>
          <strong>{receipt.reference}</strong>
        </div>
        <a className="button secondary" href="mailto:info@adboxgh.com">
          <Mail size={17} />
          Contact the team
        </a>
        {receipt.mode === 'mock' && (
          <button
            className="text-button"
            type="button"
            onClick={() => {
              setReceipt(null);
              setFurthestStep(0);
              requestKey.current = null;
              goTo(0);
            }}
          >
            Try the preview again <ArrowRight size={16} />
          </button>
        )}
      </div>
    );

  return (
    <FormProvider {...form}>
      <form
        className="application-card"
        noValidate
        onSubmit={(event) => {
          event.preventDefault();
          if (videoBusy || sending) return;
          if (step < 4) void next();
          else void form.handleSubmit(send, invalid)();
        }}
      >
        <fieldset className="form-body" disabled={sending}>
          <legend className="sr-only">Adbox campus representative application</legend>
          <ol className="stepper" aria-label="Application progress">
            {steps.map((item, index) => (
              <li
                key={item.title}
                className={index === step ? 'active' : index < step ? 'complete' : ''}
              >
                <button
                  type="button"
                  onClick={() => goTo(index)}
                  disabled={index > furthestStep || videoBusy}
                  aria-current={index === step ? 'step' : undefined}
                  aria-label={'Step ' + (index + 1) + ': ' + item.title}
                >
                  <span className="step-dot">{index < step ? <Check size={16} /> : index + 1}</span>
                  <span className="step-name">{item.title}</span>
                </button>
              </li>
            ))}
          </ol>
          <div className="form-content">
            <div className="step-heading">
              <span className="eyebrow">STEP {step + 1} OF 5</span>
              <h3 ref={heading} tabIndex={-1}>
                {steps[step].description}
              </h3>
              <p>{steps[step].caption}</p>
            </div>
            {step < 3 && (
              <>
                <p className="required-note">All questions are required unless marked optional.</p>
                <div className="fields">
                  {questions
                    .filter((question) => steps[step].fields.some((name) => name === question.name))
                    .map((question) => (
                      <QuestionField
                        key={question.name}
                        question={question}
                        number={questions.indexOf(question) + 1}
                      />
                    ))}
                </div>
              </>
            )}
            {step === 3 && (
              <VideoUpload
                value={video}
                onChange={setVideo}
                error={videoError}
                onError={setVideoError}
                busy={videoBusy}
                onBusyChange={setVideoBusy}
              />
            )}
            {step === 4 && video && (
              <>
                <Review values={form.getValues()} video={video} onEdit={goTo} />
                <div className="submission-note">
                  <ShieldCheck size={20} />
                  <p>
                    {env.isMock
                      ? 'Preview mode: nothing will be sent or stored by Adbox. Use sample details to try the form.'
                      : 'Your application includes your contact details, answers and video. Submit them to Adbox for consideration for the campus representative role. For questions, contact info@adboxgh.com.'}
                  </p>
                </div>
              </>
            )}
            {submitError && (
              <div className="request-error" role="alert">
                <CircleAlert size={20} />
                <p>{submitError}</p>
              </div>
            )}
          </div>
        </fieldset>
        <div className="form-actions">
          {step > 0 ? (
            <button
              type="button"
              className="button back-button"
              disabled={sending || videoBusy}
              onClick={() => goTo(step - 1)}
            >
              <ArrowLeft size={17} />
              Back
            </button>
          ) : (
            <span className="progress-note">Your campus journey starts here.</span>
          )}
          <button
            className="button primary continue-button"
            type="submit"
            disabled={sending || videoBusy}
          >
            {sending ? (
              <>
                <LoaderCircle size={18} className="spin" />
                {env.isMock ? 'Trying preview…' : 'Sending…'}
              </>
            ) : (
              <>
                {step === 4
                  ? env.isMock
                    ? 'Submit preview'
                    : 'Submit application'
                  : step === 3
                    ? 'Review application'
                    : 'Continue'}
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </div>
        <p className="draft-note" aria-live="polite">
          {sending
            ? 'Please keep this tab open while we finish.'
            : 'Your answers stay here as you move between steps. Keep this tab open.'}
        </p>
      </form>
    </FormProvider>
  );
}
