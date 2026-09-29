import { afterEach, describe, expect, it, vi } from 'vitest';
import { submitApplication } from './api';
import { validAnswers } from '../test/fixtures';

const video = { file: new File(['data'], 'hello.mp4', { type: 'video/mp4' }), duration: 20 };
const receipt = {
  reference: 'PREVIEW-12345678',
  receivedAt: '2026-09-29T12:00:00.000Z',
  mode: 'mock',
};
afterEach(() => vi.unstubAllGlobals());

describe('application API boundary', () => {
  it('sends multipart data and an idempotency key without setting a broken content-type', async () => {
    const fetch = vi.fn().mockResolvedValue(Response.json(receipt, { status: 201 }));
    vi.stubGlobal('fetch', fetch);
    expect(await submitApplication(validAnswers, video, 'same-key')).toEqual(receipt);
    const [url, options] = fetch.mock.calls[0];
    expect(url).toBe('/api/v1/applications');
    expect(options.headers['Idempotency-Key']).toBe('same-key');
    expect(options.headers['Content-Type']).toBeUndefined();
    expect(JSON.parse(options.body.get('answers'))).toEqual(validAnswers);
    expect(options.body.get('video').name).toBe('hello.mp4');
    expect(options.body.get('videoDurationSeconds')).toBe('20');
  });
  it('keeps retryable failures distinct from a confirmed receipt', async () => {
    const fetch = vi
      .fn()
      .mockResolvedValueOnce(Response.json({}, { status: 503 }))
      .mockResolvedValueOnce(Response.json(receipt));
    vi.stubGlobal('fetch', fetch);
    await expect(submitApplication(validAnswers, video, 'same-key')).rejects.toThrow(
      'Your answers are still here',
    );
    await expect(submitApplication(validAnswers, video, 'same-key')).resolves.toEqual(receipt);
    expect(fetch.mock.calls.map(([, options]) => options.headers['Idempotency-Key'])).toEqual([
      'same-key',
      'same-key',
    ]);
  });
  it('rejects malformed receipts and a live receipt during mock mode', async () => {
    const fetch = vi
      .fn()
      .mockResolvedValueOnce(Response.json({ ok: true }))
      .mockResolvedValueOnce(Response.json({ ...receipt, mode: 'live' }));
    vi.stubGlobal('fetch', fetch);
    await expect(submitApplication(validAnswers, video, 'key')).rejects.toThrow(
      'could not confirm',
    );
    await expect(submitApplication(validAnswers, video, 'key')).rejects.toThrow(
      'could not confirm',
    );
  });
  it('handles rate limits, oversized uploads and network loss', async () => {
    const fetch = vi
      .fn()
      .mockResolvedValueOnce(Response.json({}, { status: 429 }))
      .mockResolvedValueOnce(Response.json({}, { status: 413 }))
      .mockRejectedValueOnce(new TypeError('network'));
    vi.stubGlobal('fetch', fetch);
    await expect(submitApplication(validAnswers, video, 'key')).rejects.toThrow(
      'Too many attempts',
    );
    await expect(submitApplication(validAnswers, video, 'key')).rejects.toThrow('smaller file');
    await expect(submitApplication(validAnswers, video, 'key')).rejects.toThrow(
      'Check your connection',
    );
  });
});
