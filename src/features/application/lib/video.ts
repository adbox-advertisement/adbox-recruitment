export const MAX_VIDEO_SECONDS = 30;
export const MAX_VIDEO_BYTES = 50 * 1024 * 1024;
export const VIDEO_ACCEPT = '.mp4,.mov,.webm,video/mp4,video/quicktime,video/webm';
const types = ['video/mp4', 'video/quicktime', 'video/webm'];

export function validateVideoFile(file: File): void {
  if (file.size === 0) throw new Error('This file is empty. Please choose another video.');
  if (file.size > MAX_VIDEO_BYTES)
    throw new Error(
      'This video is over 50 MB. Choose a smaller file or record at a lower resolution.',
    );
  if (!/\.(mp4|mov|webm)$/i.test(file.name) || (file.type && !types.includes(file.type))) {
    throw new Error('Choose an MP4, MOV or WebM video.');
  }
}

export function validateVideoDuration(duration: number): void {
  if (!Number.isFinite(duration) || duration <= 0)
    throw new Error('We could not read this video. Try exporting it as an MP4.');
  if (duration > MAX_VIDEO_SECONDS)
    throw new Error('This video is longer than 30 seconds. Trim it and try again.');
}

export function readVideoDuration(file: File): Promise<number> {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    const url = URL.createObjectURL(file);
    const finish = (error?: Error) => {
      clearTimeout(timer);
      const duration = video.duration;
      video.onloadedmetadata = null;
      video.ondurationchange = null;
      video.onerror = null;
      video.removeAttribute('src');
      video.load();
      URL.revokeObjectURL(url);
      if (error) reject(error);
      else {
        try {
          validateVideoDuration(duration);
          resolve(duration);
        } catch (validationError) {
          reject(validationError);
        }
      }
    };
    const read = () => {
      // Some MediaRecorder WebM files expose Infinity until the browser seeks.
      if (video.duration === Infinity) video.currentTime = 1e10;
      else if (Number.isFinite(video.duration) && video.duration > 0) finish();
    };
    video.preload = 'metadata';
    video.muted = true;
    video.onloadedmetadata = read;
    video.ondurationchange = read;
    video.onerror = () =>
      finish(new Error('This browser could not open the video. Please try an MP4 video.'));
    const timer = setTimeout(
      () => finish(new Error('We could not read the video. Try a smaller MP4 file.')),
      15000,
    );
    video.src = url;
  });
}

export interface ApplicationVideo {
  file: File;
  duration: number;
}
