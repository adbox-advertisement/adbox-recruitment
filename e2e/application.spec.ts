import { expect, test, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

async function recordSampleVideo(page: Page) {
  const bytes = await page.evaluate(async () => {
    const canvas = document.createElement('canvas');
    canvas.width = 320;
    canvas.height = 240;
    const context = canvas.getContext('2d')!;
    const stream = canvas.captureStream(10);
    const recorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
    const chunks: Blob[] = [];
    recorder.ondataavailable = (event) => chunks.push(event.data);
    const done = new Promise<Blob>((resolve) => {
      recorder.onstop = () => resolve(new Blob(chunks, { type: 'video/webm' }));
    });
    recorder.start();
    const interval = setInterval(() => {
      context.fillStyle = '#6452e8';
      context.fillRect(0, 0, 320, 240);
      context.fillStyle = '#fff';
      context.font = '20px sans-serif';
      context.fillText('Sample application video', 30, 125);
    }, 100);
    await new Promise((resolve) => setTimeout(resolve, 1200));
    recorder.stop();
    clearInterval(interval);
    stream.getTracks().forEach((track) => track.stop());
    return Array.from(new Uint8Array(await (await done).arrayBuffer()));
  });
  return { name: 'introduction.webm', mimeType: 'video/webm', buffer: Buffer.from(bytes) };
}
async function noOverflow(page: Page) {
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true,
  );
}
async function accessible(page: Page) {
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
    .analyze();
  expect(
    results.violations.map((item) => ({
      id: item.id,
      nodes: item.nodes.map((node) => node.target),
    })),
  ).toEqual([]);
}

for (const width of [390, 1280])
  test(
    'application at ' + width + 'px: answers, video, review, failure and retry',
    async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      const errors: string[] = [];
      page.on('pageerror', (error) => errors.push(error.message));
      await page.goto('/');
      await expect(page.getByRole('heading', { name: /Your campus/ })).toBeVisible();
      await accessible(page);
      await page.getByRole('link', { name: 'Become a campus rep' }).click();
      await page.getByRole('button', { name: 'Continue' }).click();
      await expect(page.getByLabel(/Full name/)).toBeFocused();
      await page.getByLabel(/Full name/).fill('Ama Sample');
      await page.getByLabel('Which institution do you attend?').selectOption('ug');
      await page.getByLabel('Programme and year of study').fill('Economics, Year 3');
      await page.getByLabel('Phone number (WhatsApp)').fill('050 123 4567');
      await page.getByLabel('Email address').fill('ama@example.com');
      await page.getByRole('button', { name: 'Continue' }).click();
      await expect(page.getByRole('heading', { name: 'You know your campus best.' })).toBeVisible({
        timeout: 5000,
      });
      await page.getByLabel(/Which halls/).fill('Legon Hall and Balme Library.');
      await page
        .getByLabel('Why do you want to do this?')
        .fill('I would like to help students connect and share feedback.');
      await page
        .getByLabel(/Tell us about a time/)
        .fill('I brought eight classmates together for a study group.');
      await accessible(page);
      await noOverflow(page);
      await page.getByRole('button', { name: 'Back', exact: true }).click();
      await expect(page.getByLabel(/Full name/)).toHaveValue('Ama Sample');
      await page.getByRole('button', { name: 'Continue' }).click();
      await expect(page.getByLabel(/Which halls/)).toHaveValue('Legon Hall and Balme Library.');
      await page.getByRole('button', { name: 'Continue' }).click();
      await page.getByLabel(/How many hours/).fill('3 hours, Tuesday and Saturday');
      await page.getByLabel(/What phone/).fill('Samsung A15, Android');
      await page
        .getByLabel(/A student asks/)
        .fill('No, students do not get paid just for using the app.');
      await page.getByLabel('No, not yet').check();
      await page.getByRole('button', { name: 'Continue' }).click();
      await expect(
        page.getByText('Please agree to honest reporting before continuing.'),
      ).toBeVisible();
      await page.getByRole('checkbox').check();
      await accessible(page);
      await page.getByRole('button', { name: 'Continue' }).click();
      await page.getByRole('button', { name: 'Review application' }).click();
      await expect(
        page.getByText('Please add your introduction video before continuing.'),
      ).toBeVisible();
      const videoInput = page.locator('#video-upload');
      await videoInput.setInputFiles({
        name: 'not-a-video.txt',
        mimeType: 'text/plain',
        buffer: Buffer.from('test'),
      });
      await expect(
        page.getByText('Choose an MP4, MOV or WebM video.', { exact: true }),
      ).toBeVisible();
      const video = await recordSampleVideo(page);
      await videoInput.setInputFiles(video);
      await expect(page.getByText('introduction.webm', { exact: true })).toBeVisible();
      await expect(page.getByRole('button', { name: 'Review application' })).toBeEnabled();
      await page.getByRole('button', { name: 'Remove video' }).click();
      await expect(page.getByText('A little hello goes a long way.')).toBeVisible();
      await videoInput.setInputFiles(video);
      await expect(page.getByText('introduction.webm', { exact: true })).toBeVisible();
      await noOverflow(page);
      await accessible(page);
      await page.getByRole('button', { name: 'Review application' }).click();
      await expect(page.locator('.review-answer')).toHaveCount(14);
      await expect(page.locator('.review')).toContainText('Not provided');
      await page.getByRole('button', { name: 'Edit your details' }).click();
      await page.getByLabel(/Full name/).fill('Ama Sample Updated');
      await page.getByRole('button', { name: 'Step 5: Review' }).click();
      await expect(page.locator('.review')).toContainText('Ama Sample Updated');
      await accessible(page);
      await noOverflow(page);
      await page.getByRole('button', { name: 'Submit preview' }).click();
      await expect(page.getByRole('alert')).toContainText('Your answers are still here');
      await expect(page.locator('.review')).toContainText('Ama Sample Updated');
      await page.getByRole('button', { name: 'Submit preview' }).click();
      await expect(
        page.getByRole('heading', { name: 'You’ve tried the full application.' }),
      ).toBeVisible();
      await expect(
        page.getByText(
          'This was a preview. Your application and video have not been sent or saved by Adbox.',
        ),
      ).toBeVisible();
      await accessible(page);
      expect(errors).toEqual([]);
    },
  );

test('responsive layout and keyboard-friendly FAQ', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: /Your campus/ })).toBeVisible();
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await noOverflow(page);
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await accessible(page);
  await page.getByText('Do I need a polished video?', { exact: true }).click();
  await expect(page.getByText(/A simple introduction on your phone is perfect/)).toBeVisible();
  await page.evaluate(() => {
    (document.activeElement as HTMLElement)?.blur();
    window.scrollTo(0, 0);
  });
  await page.screenshot({ path: 'test-results/mobile.png', fullPage: true });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({ path: 'test-results/desktop.png', fullPage: true });
  expect(
    await page.evaluate(
      async () => (await (await fetch('/api/v1/institutions')).json()).institutions.length,
    ),
  ).toBe(22);
});
