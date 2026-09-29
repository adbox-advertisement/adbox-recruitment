import { Pencil, Film, Check } from 'lucide-react';
import { institutionName } from '../../../data/institutions';
import { questions, steps } from '../questions';
import type { ApplicationValues } from '../schema';
import type { ApplicationVideo } from '../lib/video';
import { useEffect, useRef } from 'react';

export function Review({
  values,
  video,
  onEdit,
}: {
  values: ApplicationValues;
  video: ApplicationVideo;
  onEdit: (step: number) => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const url = URL.createObjectURL(video.file);
    if (videoRef.current) videoRef.current.src = url;
    return () => URL.revokeObjectURL(url);
  }, [video]);
  return (
    <div className="review">
      {steps.slice(0, 3).map((step, index) => (
        <section className="review-section" key={step.title}>
          <div className="review-title">
            <h3>{step.title}</h3>
            <button
              type="button"
              className="text-button"
              onClick={() => onEdit(index)}
              aria-label={'Edit ' + step.title.toLowerCase()}
            >
              <Pencil size={15} />
              Edit
            </button>
          </div>
          <dl>
            {step.fields.map((name) => {
              const value = values[name];
              const answer =
                name === 'institution'
                  ? institutionName(String(value))
                  : name === 'comfortable'
                    ? value === 'yes'
                      ? 'Yes'
                      : 'No'
                    : typeof value === 'boolean'
                      ? value
                        ? 'I agree'
                        : 'Not agreed'
                      : value || 'Not provided';
              return (
                <div className="review-answer" key={name}>
                  <dt>{questions.find((question) => question.name === name)?.label}</dt>
                  <dd>
                    {name === 'honesty' && <Check size={16} />}
                    {answer}
                  </dd>
                </div>
              );
            })}
          </dl>
        </section>
      ))}
      <section className="review-section">
        <div className="review-title">
          <h3>
            <Film size={18} />
            Your video
          </h3>
          <button
            type="button"
            className="text-button"
            onClick={() => onEdit(3)}
            aria-label="Edit your video"
          >
            <Pencil size={15} />
            Edit
          </button>
        </div>
        <video
          ref={videoRef}
          controls
          playsInline
          preload="metadata"
          className="review-video"
          aria-label="Review your application video"
        >
          <track kind="captions" />
        </video>
        <p className="review-file">
          {video.file.name} · {Math.min(30, Math.ceil(video.duration))} seconds
        </p>
      </section>
    </div>
  );
}
