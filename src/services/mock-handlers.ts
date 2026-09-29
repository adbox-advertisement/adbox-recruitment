import { delay, http, HttpResponse } from 'msw';
import { env } from '../config/env';
import { institutions } from '../data/institutions';
import { applicationSchema } from '../features/application/schema';
import { validateVideoDuration, validateVideoFile } from '../features/application/lib/video';

let attempts = 0;

export const handlers = [
  http.get(env.apiBaseUrl + '/institutions', () => HttpResponse.json({ institutions })),
  http.post(env.apiBaseUrl + '/applications', async ({ request }) => {
    await delay(850);
    attempts += 1;
    if (env.mockFailure === 'always' || (env.mockFailure === 'once' && attempts === 1)) {
      return HttpResponse.json({ message: 'Simulated temporary failure' }, { status: 503 });
    }
    try {
      const body = await request.formData();
      applicationSchema.parse(JSON.parse(String(body.get('answers'))));
      const file = body.get('video');
      if (!(file instanceof File)) throw new Error('Video required');
      validateVideoFile(file);
      validateVideoDuration(Number(body.get('videoDurationSeconds')));
      const key = request.headers.get('Idempotency-Key');
      if (!key || !/^[\da-f-]{36}$/i.test(key)) throw new Error('Valid idempotency key required');
      // No applicant data, file or receipt is retained, logged or sent anywhere.
      return HttpResponse.json(
        {
          reference: 'PREVIEW-' + key.slice(0, 8).toUpperCase(),
          receivedAt: new Date().toISOString(),
          mode: 'mock',
        },
        { status: 201 },
      );
    } catch {
      return HttpResponse.json({ message: 'Invalid application' }, { status: 422 });
    }
  }),
];
