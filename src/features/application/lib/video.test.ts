import { describe, expect, it } from 'vitest';
import { MAX_VIDEO_BYTES, validateVideoDuration, validateVideoFile } from './video';

describe('video validation', () => {
  it('accepts supported files including phones that omit MIME metadata', () => {
    for (const [name, type] of [
      ['hello.mp4', 'video/mp4'],
      ['hello.MOV', 'video/quicktime'],
      ['hello.webm', 'video/webm'],
      ['hello.mp4', ''],
    ]) {
      expect(() => validateVideoFile(new File(['video'], name, { type }))).not.toThrow();
    }
  });
  it('rejects disguised files and unsupported formats', () => {
    expect(() => validateVideoFile(new File(['x'], 'video.mp4', { type: 'text/html' }))).toThrow(
      'Choose an MP4',
    );
    expect(() => validateVideoFile(new File(['x'], 'video.avi', { type: 'video/avi' }))).toThrow(
      'Choose an MP4',
    );
  });
  it('rejects empty and oversized files before reading media metadata', () => {
    expect(() => validateVideoFile(new File([], 'hello.mp4'))).toThrow('empty');
    const large = new File(['x'], 'large.mp4', { type: 'video/mp4' });
    Object.defineProperty(large, 'size', { value: MAX_VIDEO_BYTES + 1 });
    expect(() => validateVideoFile(large)).toThrow('over 50 MB');
  });
  it('accepts a video of 30 seconds and shorter', () => {
    for (const duration of [0.1, 15, 30])
      expect(() => validateVideoDuration(duration)).not.toThrow();
  });
  it('rejects overlong and unreadable duration values', () => {
    for (const duration of [30.1, 31, Infinity, NaN, 0, -1])
      expect(() => validateVideoDuration(duration)).toThrow();
  });
});
