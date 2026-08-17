import { chromium } from 'playwright';

const BASE_URL = 'http://127.0.0.1:5173';
const VIEWPORTS = [1440, 1280, 1024, 768, 390];
const COURSE_IDS = [
  'buyongcheon',
  'jungnangcheon',
  'baekseokcheon',
  'jikdong',
  'chudong',
  'songsansaji',
];
const results = [];

function record(viewport, check, pass, detail = '') {
  results.push({ viewport, check, pass, detail });
}

async function assertNoHorizontalScroll(page, viewport) {
  const overflow = await page.evaluate(() => {
    const doc = document.documentElement;
    return doc.scrollWidth > doc.clientWidth + 1;
  });
  record(
    viewport,
    'no-horizontal-scroll',
    !overflow,
    overflow
      ? `scrollWidth=${await page.evaluate(() => document.documentElement.scrollWidth)}`
      : '',
  );
}

async function checkHome(page, viewport) {
  await page.goto(`${BASE_URL}/`);

  const guideVisible = await page
    .getByText('RunRoute 코스 정보 가이드')
    .isVisible()
    .catch(() => false);
  record(viewport, 'home-no-guide', !guideVisible);

  const noticeVisible = await page
    .getByText(/MVP 검증을 위한 샘플 데이터/)
    .isVisible();
  record(viewport, 'home-sample-notice', noticeVisible);

  const card = page.locator('div[aria-label="추천 코스 목록"] article').first();
  await card.waitFor({ state: 'visible' });

  const inset = await card.evaluate((el) => {
    const imageWrapper = el.querySelector('a > div:first-child');
    const content = el.querySelector('a > div:last-child');
    if (!imageWrapper || !content) return null;

    const cardBox = el.getBoundingClientRect();
    const imageBox = imageWrapper.getBoundingClientRect();
    const contentStyle = getComputedStyle(content);

    const imageEdgeToEdge =
      Math.abs(imageBox.left - cardBox.left) < 2 &&
      Math.abs(imageBox.right - cardBox.right) < 2;
    const paddingLeft = parseFloat(contentStyle.paddingLeft);
    const paddingRight = parseFloat(contentStyle.paddingRight);

    return { imageEdgeToEdge, paddingLeft, paddingRight };
  });

  if (!inset) {
    record(viewport, 'home-card-content-inset', false, 'content wrapper not found');
  } else {
    const expectedHorizontal = 20;
    const horizontalOk =
      Math.abs(inset.paddingLeft - expectedHorizontal) <= 1 &&
      Math.abs(inset.paddingRight - expectedHorizontal) <= 1;
    record(
      viewport,
      'home-card-content-inset',
      horizontalOk,
      `left=${inset.paddingLeft}, right=${inset.paddingRight}`,
    );
    record(
      viewport,
      'home-card-image-edge-to-edge',
      inset.imageEdgeToEdge,
      JSON.stringify(inset),
    );
  }

  await assertNoHorizontalScroll(page, viewport);
}

async function checkDetail(page, viewport, courseId) {
  await page.goto(`${BASE_URL}/courses/${courseId}`);

  const envGrid = page.locator('section[aria-label="러닝 환경"]');
  await envGrid.waitFor({ state: 'visible' });

  const envColumns = await envGrid.evaluate((el) => {
    const style = getComputedStyle(el);
    return style.gridTemplateColumns.split(' ').filter(Boolean).length;
  });

  const expectedColumns = viewport >= 768 ? 2 : 1;
  record(
    viewport,
    `detail-${courseId}-environment-columns`,
    envColumns === expectedColumns,
    `expected=${expectedColumns}, actual=${envColumns}`,
  );

  const overflowItems = await page.evaluate(() => {
    const items = document.querySelectorAll('section[aria-label="러닝 환경"] dd span');
    return Array.from(items).filter((el) => {
      const parent = el.parentElement;
      if (!parent) return false;
      return el.scrollWidth > parent.clientWidth + 1;
    }).length;
  });

  record(
    viewport,
    `detail-${courseId}-no-value-overflow`,
    overflowItems === 0,
    `overflowCount=${overflowItems}`,
  );

  const noticeVisible = await page
    .getByText(/MVP 검증을 위한 샘플 데이터/)
    .isVisible();
  record(viewport, `detail-${courseId}-sample-notice`, noticeVisible);

  await assertNoHorizontalScroll(page, viewport);
}

async function runFlowChecks(page) {
  await page.goto(`${BASE_URL}/courses/buyongcheon`);
  await page.getByRole('button', { name: '코스 저장' }).click();
  record('flow', 'detail-save-toast', await page.getByText('코스가 저장되었습니다!').isVisible());

  await page.getByRole('button', { name: '코스 저장 해제' }).click();
  record(
    'flow',
    'detail-unsave-toast',
    await page.getByText('코스 저장이 해제되었습니다').isVisible(),
  );

  await page.getByRole('button', { name: '코스 저장' }).click();
  await page.getByRole('button', { name: '저장한 코스 보기' }).click();
  record(
    'flow',
    'saved-toast-navigation',
    page.url().endsWith('/saved') &&
      (await page.getByRole('heading', { name: '저장한 코스' }).isVisible()),
  );

  await page.goto(`${BASE_URL}/courses/buyongcheon`);
  await page.getByRole('button', { name: '길찾기' }).click();
  const dialog = page.getByRole('dialog', { name: '길찾기 기능을 준비하고 있습니다.' });
  record('flow', 'directions-modal-open', await dialog.isVisible());
  await page.keyboard.press('Escape');
  record('flow', 'directions-modal-esc-close', !(await dialog.isVisible()));

  await page.goto(`${BASE_URL}/`);
  const homeSaveButton = page
    .getByRole('button', { name: /저장$/ })
    .filter({ hasNot: page.getByText('저장한 코스') })
    .first();
  if (await homeSaveButton.count()) {
    await homeSaveButton.click();
    record(
      'flow',
      'home-bookmark-no-toast',
      !(await page.getByText('코스가 저장되었습니다!').isVisible()),
    );
  } else {
    record('flow', 'home-bookmark-no-toast', false, 'home save button not found');
  }

  await page.goto(`${BASE_URL}/courses/buyongcheon`);
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  record(
    'flow',
    'save-label-저장',
    (await page.getByRole('button', { name: '코스 저장' }).textContent())?.includes('저장') ??
      false,
  );

  await page.goto(`${BASE_URL}/courses/not-a-course`);
  record(
    'flow',
    'invalid-course-error',
    await page.getByText('코스 정보를 찾을 수 없습니다.').isVisible(),
  );

  await page.goto(`${BASE_URL}/saved`);
  record(
    'flow',
    'saved-empty-state',
    await page.getByText('아직 저장한 코스가 없습니다').isVisible(),
  );

  await page.goto(`${BASE_URL}/courses/buyongcheon`);
  await page.getByRole('button', { name: '코스 저장' }).click();
  await page.reload();
  const persisted = await page.evaluate(() =>
    localStorage.getItem('runroute:saved-course-ids'),
  );
  record('flow', 'persistence', persisted?.includes('buyongcheon') ?? false, persisted ?? '');
}

async function checkDistinctEnvironmentValues(page) {
  const summaries = [];
  for (const courseId of COURSE_IDS) {
    await page.goto(`${BASE_URL}/courses/${courseId}`);
    const summary = await page
      .locator('[data-testid="course-detail-hero"] p')
      .first()
      .textContent();
    summaries.push(summary?.trim() ?? '');
  }
  record(
    'data',
    'distinct-summaries',
    new Set(summaries).size === COURSE_IDS.length,
    summaries.join(' | '),
  );

  await page.goto(`${BASE_URL}/courses/buyongcheon`);
  record(
    'data',
    'buyongcheon-primary-helper',
    (await page.getByText('밝음', { exact: true }).first().isVisible()) &&
      (await page.getByText('주요 구간 가로등 연속 배치', { exact: true }).first().isVisible()),
  );

  await page.goto(`${BASE_URL}/courses/jikdong`);
  record(
    'data',
    'jikdong-stairs-slope',
    (await page.getByText('일부 있음', { exact: true }).first().isVisible()) &&
      (await page.getByText('숲길 연결부 2구간', { exact: true }).first().isVisible()),
  );

  await page.goto(`${BASE_URL}/courses/chudong`);
  record(
    'data',
    'chudong-locker',
    (await page.getByText('체육시설 인근', { exact: true }).first().isVisible()),
  );

  await page.goto(`${BASE_URL}/courses/songsansaji`);
  const noneCount = await page.getByText('없음', { exact: true }).count();
  const unsetCount = await page.getByText('미설치', { exact: true }).count();
  record(
    'data',
    'songsansaji-none-unset',
    noneCount >= 2 && unsetCount >= 2,
    `none=${noneCount}, unset=${unsetCount}`,
  );
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  const consoleErrors = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      const text = msg.text();
      if (text.includes('Failed to load resource') && text.includes('404')) {
        return;
      }
      consoleErrors.push(text);
    }
  });
  page.on('pageerror', (err) => consoleErrors.push(err.message));

  for (const viewport of VIEWPORTS) {
    await page.setViewportSize({ width: viewport, height: 900 });
    await checkHome(page, viewport);
    for (const courseId of COURSE_IDS) {
      await checkDetail(page, viewport, courseId);
    }
  }

  await checkDistinctEnvironmentValues(page);
  await runFlowChecks(page);

  record('final', 'console-errors', consoleErrors.length === 0, consoleErrors.join(' | '));

  await browser.close();

  const failed = results.filter((r) => !r.pass);
  console.log(JSON.stringify({ results, failedCount: failed.length }, null, 2));
  if (failed.length > 0) {
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
