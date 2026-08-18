import { spawn } from 'node:child_process';
import { chromium } from 'playwright';

const PORT = 4173;
const BASE_URL = `http://127.0.0.1:${PORT}`;
const VIEWPORTS = [
  { name: 'desktop-1440', width: 1440, height: 900 },
  { name: 'desktop-1280', width: 1280, height: 900 },
  { name: 'tablet-768', width: 768, height: 1024 },
  { name: 'mobile-390', width: 390, height: 844 },
];

const results = [];
function record(category, testName, pass, detail = '') {
  results.push({ category, testName, pass, detail });
  const status = pass ? 'PASS' : 'FAIL';
  console.log(`[${status}] [${category}] ${testName}${detail ? ` -> ${detail}` : ''}`);
}

async function startPreviewServer() {
  const previewProcess = spawn('npx', ['vite', 'preview', '--host', '127.0.0.1', '--port', String(PORT), '--strictPort'], {
    stdio: 'pipe',
  });

  await new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(new Error('Vite preview server timeout (10s)'));
    }, 10000);

    previewProcess.stdout.on('data', (data) => {
      const msg = data.toString();
      if (msg.includes(String(PORT)) || msg.includes('Local:')) {
        clearTimeout(timeout);
        resolve();
      }
    });

    previewProcess.stderr.on('data', (data) => {
      console.error('[preview stderr]', data.toString());
    });

    previewProcess.on('error', (err) => {
      clearTimeout(timeout);
      reject(err);
    });
  });

  return previewProcess;
}

async function checkNoHorizontalScroll(page, label) {
  const overflow = await page.evaluate(() => {
    const doc = document.documentElement;
    return doc.scrollWidth > doc.clientWidth + 1;
  });
  const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
  const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
  record(
    'responsive-overflow',
    `${label} no horizontal scroll`,
    !overflow,
    `scrollWidth=${scrollWidth}, clientWidth=${clientWidth}`,
  );
}

async function runRegressionQA() {
  console.log('--- Starting Vite preview server ---');
  const server = await startPreviewServer();
  console.log(`Preview server ready at ${BASE_URL}`);

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  const consoleErrors = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      const text = msg.text();
      const loc = msg.location();
      const url = loc?.url || '';
      if (url.includes('favicon.ico') || text.includes('favicon.ico')) return;
      consoleErrors.push(`${text} (${url})`);
    }
  });
  page.on('pageerror', (err) => {
    consoleErrors.push(err.message);
  });

  try {
    // 1. Viewport & Layout checks
    console.log('\n--- 1. Responsive & Viewport QA ---');
    for (const vp of VIEWPORTS) {
      await page.setViewportSize({ width: vp.width, height: vp.height });

      // Home
      await page.goto(`${BASE_URL}/`);
      await page.waitForSelector('main');
      await checkNoHorizontalScroll(page, `${vp.name} HomePage`);

      // Detail
      await page.goto(`${BASE_URL}/courses/buyongcheon`);
      await page.waitForSelector('main');
      await checkNoHorizontalScroll(page, `${vp.name} CourseDetailPage`);

      // Saved
      await page.goto(`${BASE_URL}/saved`);
      await page.waitForSelector('main');
      await checkNoHorizontalScroll(page, `${vp.name} SavedPage`);

      // Login Modal
      await page.goto(`${BASE_URL}/`);
      await page.waitForSelector('main');
      const loginBtn = page.getByRole('button', { name: '로그인' });
      if (await loginBtn.isVisible()) {
        await loginBtn.click();
        await page.waitForSelector('[role="dialog"]');
        await checkNoHorizontalScroll(page, `${vp.name} LoginModal`);
        await page.keyboard.press('Escape');
        await page.waitForTimeout(200);
      }
    }

    // Reset to desktop 1280
    await page.setViewportSize({ width: 1280, height: 900 });

    // 2. Unauthenticated Core User Flow QA
    console.log('\n--- 2. Unauthenticated User Flow QA ---');
    await page.evaluate(() => localStorage.clear());
    await page.goto(`${BASE_URL}/`);

    // Verify Home content
    const homeTitle = await page.getByRole('heading', { level: 1 }).textContent();
    record('core-flow', 'HomePage loads successfully', !!homeTitle && homeTitle.length > 0, homeTitle);

    // Verify Course cards exist
    const cards = page.locator('article');
    const cardCount = await cards.count();
    record('core-flow', 'Course cards displayed on Home', cardCount >= 3, `count=${cardCount}`);

    // Click on a course to navigate to detail
    await page.goto(`${BASE_URL}/courses/buyongcheon`);
    const courseTitle = await page.getByRole('heading', { level: 1 }).textContent();
    record('core-flow', 'CourseDetail loaded', courseTitle?.includes('부용천') ?? false, courseTitle ?? '');

    // Atmosphere / Mood card structure preservation check
    const moodCard = page.getByText(/코스 분위기|분위기|러닝 코스 특징/i);
    record('core-flow', 'Atmosphere/Mood section preserved', (await moodCard.count()) > 0);

    // Save Course in detail
    const saveBtn = page.getByRole('button', { name: '코스 저장' });
    await saveBtn.click();
    const saveToast = page.getByText('코스가 저장되었습니다!');
    record('core-flow', 'Save course toast visible', await saveToast.isVisible());

    // Navigate to Saved page
    await page.goto(`${BASE_URL}/saved`);
    const savedCard = page.locator('article');
    const savedCount = await savedCard.count();
    record('core-flow', 'Saved page displays saved course', savedCount >= 1, `savedCount=${savedCount}`);

    // Unsave course in Saved page
    const unsaveBtn = page.getByRole('button', { name: /코스 저장 해제|저장 해제/ }).first();
    await unsaveBtn.click();
    await page.waitForTimeout(300);

    // Empty state check
    const emptyState = page.getByText('아직 저장한 코스가 없습니다');
    record('core-flow', 'Saved page empty state visible after all removed', await emptyState.isVisible());

    // Directions Modal check
    await page.goto(`${BASE_URL}/courses/buyongcheon`);
    const directionsBtn = page.getByRole('button', { name: '길찾기' });
    await directionsBtn.click();
    const directionsDialog = page.getByRole('dialog', { name: '길찾기 기능을 준비하고 있습니다.' });
    record('core-flow', 'Directions modal opens', await directionsDialog.isVisible());

    // Close Modal by ESC
    await page.keyboard.press('Escape');
    await page.waitForTimeout(200);
    record('core-flow', 'Directions modal closes on ESC', !(await directionsDialog.isVisible()));

    // 3. Error State QA
    console.log('\n--- 3. Error Boundary / Not Found QA ---');
    await page.goto(`${BASE_URL}/courses/not-found-course`);
    const errorMsg = page.getByText('코스 정보를 찾을 수 없습니다.');
    const homeCta = page.getByRole('link', { name: /돌아가기/i });
    record('error-boundary', 'Invalid course ID shows error UI', await errorMsg.isVisible());
    record('error-boundary', 'Home return CTA is visible on error UI', await homeCta.isVisible());
    if (await homeCta.isVisible()) {
      await homeCta.click();
      await page.waitForURL(`${BASE_URL}/`);
      record('error-boundary', 'Home return CTA navigates to /', page.url() === `${BASE_URL}/`);
    }

    // 4. Simulated Login / Auth & Independence QA
    console.log('\n--- 4. Simulated Auth QA ---');
    // Open login modal via header button
    await page.goto(`${BASE_URL}/`);
    await page.waitForSelector('main');
    const headerLoginBtn = page.getByRole('button', { name: '로그인' });
    record('auth-flow', 'Header shows login button when logged out', await headerLoginBtn.isVisible());

    await headerLoginBtn.click();
    const loginDialog = page.getByRole('dialog');
    record('auth-flow', 'Login modal opens on button click', await loginDialog.isVisible());

    // Notice about demo login
    const demoNotice = page.getByText(/데모 로그인/);
    record('auth-flow', 'Demo notice clearly explained', await demoNotice.isVisible());

    // Input fields validation
    const emailInput = page.getByLabel(/이메일/i);
    const passwordInput = page.getByLabel(/비밀번호/i);
    const submitBtn = loginDialog.getByRole('button', { name: '로그인' });

    // Try empty submit
    await submitBtn.click();
    const alertMsg = page.getByRole('alert');
    record('auth-flow', 'Empty submit blocked by validation', await alertMsg.isVisible());

    // Valid login
    await emailInput.fill('runner@example.com');
    await passwordInput.fill('password123');
    await submitBtn.click();
    await page.waitForTimeout(300);
    record('auth-flow', 'Login modal closes on successful login', !(await loginDialog.isVisible()));

    // Check Header auth menu shows email and logout button
    const userEmailInHeader = page.getByText('runner@example.com');
    const logoutBtn = page.getByRole('button', { name: '로그아웃' });
    record('auth-flow', 'Header shows user email', await userEmailInHeader.isVisible());
    record('auth-flow', 'Header shows logout button', await logoutBtn.isVisible());

    // Refresh page maintains login session
    await page.reload();
    record('auth-flow', 'Login persists across page reload', await userEmailInHeader.isVisible());

    // Verify localStorage auth session structure (no password stored)
    const storedAuth = await page.evaluate(() => localStorage.getItem('runroute:auth-session'));
    const parsedAuth = storedAuth ? JSON.parse(storedAuth) : null;
    record(
      'auth-flow',
      'Auth session stored without password',
      parsedAuth?.email === 'runner@example.com' && !('password' in parsedAuth),
      JSON.stringify(parsedAuth),
    );

    // Save a course while logged in
    await page.goto(`${BASE_URL}/courses/buyongcheon`);
    await page.getByRole('button', { name: '코스 저장' }).click();
    await page.waitForTimeout(200);

    const savedKeysBeforeLogout = await page.evaluate(() =>
      localStorage.getItem('runroute:saved-course-ids'),
    );
    record(
      'auth-saved-independence',
      'Saved course stored during logged in state',
      savedKeysBeforeLogout?.includes('buyongcheon') ?? false,
      savedKeysBeforeLogout ?? '',
    );

    // Logout
    await logoutBtn.click();
    await page.waitForTimeout(200);

    const loginButton = page.getByRole('button', { name: '로그인' });
    record('auth-flow', 'Logout restores 로그인 button in header', await loginButton.isVisible());

    const storedAuthAfterLogout = await page.evaluate(() =>
      localStorage.getItem('runroute:auth-session'),
    );
    record('auth-flow', 'Auth session cleared on logout', storedAuthAfterLogout === null);

    // Saved courses should STILL exist after logout!
    const savedKeysAfterLogout = await page.evaluate(() =>
      localStorage.getItem('runroute:saved-course-ids'),
    );
    record(
      'auth-saved-independence',
      'Saved courses preserved after logout (independent)',
      savedKeysAfterLogout?.includes('buyongcheon') ?? false,
      savedKeysAfterLogout ?? '',
    );

    // 5. Router & History Navigation QA
    console.log('\n--- 5. Router & History QA ---');
    await page.goto(`${BASE_URL}/`);
    // Click on Buyongcheon course card
    const courseLink = page.locator('article a[href="/courses/buyongcheon"]').first();
    await courseLink.click();
    await page.waitForURL('**/courses/buyongcheon');
    record('router-history', 'Navigated from / to /courses/buyongcheon via link', page.url().endsWith('/courses/buyongcheon'));

    // Click on Saved link in header
    const savedHeaderLink = page.getByRole('link', { name: '저장한 코스' });
    await savedHeaderLink.click();
    await page.waitForURL('**/saved');
    record('router-history', 'Navigated to /saved via header link', page.url().endsWith('/saved'));

    // History Back -> /courses/buyongcheon
    await page.goBack();
    record('router-history', 'Back to /courses/buyongcheon', page.url().endsWith('/courses/buyongcheon'));

    // History Back -> /
    await page.goBack();
    record('router-history', 'Back to /', page.url() === `${BASE_URL}/`);

    // History Forward -> /courses/buyongcheon
    await page.goForward();
    record('router-history', 'Forward to /courses/buyongcheon', page.url().endsWith('/courses/buyongcheon'));

    // 6. Direct URL Access QA
    console.log('\n--- 6. Direct URL Access QA ---');
    const directRoutes = [
      { path: '/', titleCheck: '오늘 어디서 뛰어볼까요?' },
      { path: '/saved', titleCheck: '저장한 코스' },
      { path: '/courses/buyongcheon', titleCheck: '부용천' },
    ];

    for (const route of directRoutes) {
      await page.goto(`${BASE_URL}${route.path}`);
      const pageText = await page.textContent('body');
      const ok = pageText?.includes(route.titleCheck) ?? false;
      record('direct-routes', `Direct access to ${route.path} renders correctly`, ok, route.titleCheck);
    }

    // 7. Console Error QA
    console.log('\n--- 7. Console Errors QA ---');
    record(
      'console-check',
      '0 uncaught console/runtime errors',
      consoleErrors.length === 0,
      consoleErrors.join(' | '),
    );

  } finally {
    await browser.close();
    server.kill();
  }

  const failed = results.filter((r) => !r.pass);
  console.log(`\n========================================`);
  console.log(`QA Result: ${results.length - failed.length}/${results.length} PASSED. (${failed.length} failed)`);
  console.log(`========================================`);

  if (failed.length > 0) {
    console.error('Failed checks:');
    failed.forEach((f) => console.error(` - [${f.category}] ${f.testName}: ${f.detail}`));
    process.exit(1);
  }
}

runRegressionQA().catch((err) => {
  console.error('QA Runner Exception:', err);
  process.exit(1);
});
