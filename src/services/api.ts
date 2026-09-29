import { z } from 'zod';
import { env } from '../config/env';
import type { ApplicationValues } from '../features/application/schema';
import type { ApplicationVideo } from '../features/application/lib/video';

export const receiptSchema = z.object({
  reference: z.string().min(1),
  receivedAt: z.string().datetime(),
  mode: z.enum(['mock', 'live']),
});
export type ApplicationReceipt = z.infer<typeof receiptSchema>;

export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export async function submitApplication(
  values: ApplicationValues,
  video: ApplicationVideo,
  idempotencyKey: string,
  signal?: AbortSignal,
): Promise<ApplicationReceipt> {
  const body = new FormData();
  body.append('answers', JSON.stringify(values));
  body.append('video', video.file);
  body.append('videoDurationSeconds', String(video.duration));
  const controller = new AbortController();
  const forwardAbort = () => controller.abort();
  signal?.addEventListener('abort', forwardAbort, { once: true });
  if (signal?.aborted) controller.abort();
  const timeout = setTimeout(() => controller.abort(), 120000);
  try {
    const response = await fetch(env.apiBaseUrl + '/applications', {
      method: 'POST',
      body,
      signal: controller.signal,
      credentials: 'omit',
      headers: { 'Idempotency-Key': idempotencyKey, Accept: 'application/json' },
    });
    if (!response.ok) {
      const messages: Record<number, string> = {
        409: 'An application has already been received for these details. Contact us if you need to make a change.',
        413: 'The server could not accept this video. Please choose a smaller file.',
        422: 'Some application details could not be accepted. Review your answers and video, then try again.',
        429: 'Too many attempts. Please wait a moment, then try again.',
      };
      throw new ApiError(
        messages[response.status] ??
          'We could not send your application. Your answers are still here — please try again.',
        response.status,
      );
    }
    const parsed = receiptSchema.safeParse(await response.json());
    if (!parsed.success || parsed.data.mode !== (env.isMock ? 'mock' : 'live')) {
      throw new ApiError('We could not confirm your application. Please try again or contact us.');
    }
    return parsed.data;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    if (controller.signal.aborted)
      throw new ApiError(
        'The request timed out or was cancelled. Your answers are still here. Please try again.',
      );
    throw new ApiError(
      'We could not connect. Check your connection and try again. Your answers are still here.',
    );
  } finally {
    clearTimeout(timeout);
    signal?.removeEventListener('abort', forwardAbort);
  }
}
