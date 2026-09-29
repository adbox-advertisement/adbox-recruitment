import { useEffect, useRef, useState } from 'react';
import { Camera, Check, Film, LoaderCircle, Trash2, Upload } from 'lucide-react';
import {
  readVideoDuration,
  validateVideoFile,
  VIDEO_ACCEPT,
  type ApplicationVideo,
} from '../lib/video';

export function VideoUpload({
  value,
  onChange,
  error,
  onError,
  busy,
  onBusyChange,
}: {
  value: ApplicationVideo | null;
  onChange: (value: ApplicationVideo | null) => void;
  error: string;
  onError: (value: string) => void;
  busy: boolean;
  onBusyChange: (value: boolean) => void;
}) {
  const upload = useRef<HTMLInputElement>(null);
  const capture = useRef<HTMLInputElement>(null);
  const preview = useRef<HTMLVideoElement>(null);
  const generation = useRef(0);
  const [dragging, setDragging] = useState(false);
  useEffect(
    () => () => {
      generation.current += 1;
    },
    [],
  );
  useEffect(() => {
    if (!value || !preview.current) return;
    const url = URL.createObjectURL(value.file);
    preview.current.src = url;
    return () => URL.revokeObjectURL(url);
  }, [value]);

  async function choose(file?: File) {
    if (!file) return;
    const current = ++generation.current;
    onError('');
    onBusyChange(true);
    try {
      validateVideoFile(file);
      const duration = await readVideoDuration(file);
      if (current === generation.current) onChange({ file, duration });
    } catch (caught) {
      if (current === generation.current)
        onError(caught instanceof Error ? caught.message : 'Please try another video.');
    } finally {
      if (current === generation.current) onBusyChange(false);
    }
  }
  return (
    <div className="video-step">
      <div className="video-prompt">
        <span className="icon-tile">
          <Camera size={23} />
        </span>
        <div>
          <h3>Why should we choose you?</h3>
          <p>
            Tell us who you are and what you would bring to your campus. Keep it to 30 seconds or
            less.
          </p>
        </div>
      </div>
      <div
        className={'upload-zone' + (dragging ? ' is-dragging' : '')}
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          if (!busy) void choose(event.dataTransfer.files[0]);
        }}
      >
        {value ? (
          <div className="selected-video">
            <video
              ref={preview}
              controls
              playsInline
              preload="metadata"
              aria-label="Your application video preview"
            >
              <track kind="captions" />
            </video>
            <div className="file-details">
              <span className="file-check">
                <Check size={18} />
              </span>
              <div>
                <strong>{value.file.name}</strong>
                <span>
                  {Math.min(30, Math.ceil(value.duration))} seconds ·{' '}
                  {(value.file.size / 1024 / 1024).toFixed(1)} MB
                </span>
              </div>
            </div>
          </div>
        ) : (
          <>
            <span className="upload-symbol">
              <Film size={30} strokeWidth={1.5} />
            </span>
            <h3>A little hello goes a long way.</h3>
            <p>Choose a video or drag it here.</p>
          </>
        )}
        <input
          className="sr-only"
          ref={upload}
          id="video-upload"
          type="file"
          accept={VIDEO_ACCEPT}
          tabIndex={-1}
          aria-label="Choose your application video"
          onChange={(event) => {
            void choose(event.target.files?.[0]);
            event.target.value = '';
          }}
        />
        <input
          className="sr-only"
          ref={capture}
          type="file"
          accept="video/*"
          capture="user"
          tabIndex={-1}
          aria-label="Record your application video"
          onChange={(event) => {
            void choose(event.target.files?.[0]);
            event.target.value = '';
          }}
        />
        <div className="upload-actions">
          <button
            id="video-choose"
            type="button"
            className="button primary"
            disabled={busy}
            onClick={() => upload.current?.click()}
            aria-describedby="video-rules video-error"
          >
            {busy ? <LoaderCircle size={18} className="spin" /> : <Upload size={18} />}
            {busy ? 'Checking video…' : value ? 'Replace video' : 'Choose video'}
          </button>
          <button
            type="button"
            className="button secondary"
            disabled={busy}
            onClick={() => capture.current?.click()}
          >
            <Camera size={18} />
            Use camera
          </button>
          {value && (
            <button
              type="button"
              className="icon-button remove-video"
              aria-label="Remove video"
              disabled={busy}
              onClick={() => {
                onChange(null);
                onError('');
              }}
            >
              <Trash2 size={19} />
            </button>
          )}
        </div>
        <p className="upload-rules" id="video-rules">
          Required · Up to 30 seconds · Maximum 50 MB
          <br />
          MP4, MOV or WebM
        </p>
      </div>
      <div id="video-error" role={error ? 'alert' : undefined}>
        {error && <p className="field-error">{error}</p>}
      </div>
      <div className="video-tips">
        <strong>You don’t need a perfect take.</strong>
        <p>
          Find a quiet spot, face the light and speak naturally. On supported phones, “Use camera”
          opens your camera. Record up to 30 seconds, then stop.
        </p>
      </div>
    </div>
  );
}
