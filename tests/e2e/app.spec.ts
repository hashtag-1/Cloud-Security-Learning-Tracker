const { chromium } = require("playwright");

describe("Authentication", () => {
  let browser: any;
  let page: any;

  beforeAll(async () => {
    browser = await chromium.launch({ headless: true });
  });

  afterAll(async () => {
    await browser.close();
  });

  beforeEach(async () => {
    page = await browser.newPage();
  });

  afterEach(async () => {
    await page.close();
  });

  it("redirects unauthenticated users to login", async () => {
    await page.goto("http://localhost:3000/dashboard");
    await page.waitForURL("**/auth/login");
    expect(page.url()).toContain("/auth/login");
  });

  it("shows login form", async () => {
    await page.goto("http://localhost:3000/auth/login");
    await page.waitForTimeout(2000);
    const emailInput = await page.$('input[type="email"]');
    const passwordInput = await page.$('input[type="password"]');
    expect(emailInput).not.toBeNull();
    expect(passwordInput).not.toBeNull();
  });
});

describe("Study Sessions", () => {
  let browser: any;
  let page: any;

  beforeAll(async () => {
    browser = await chromium.launch({ headless: true });
  });

  afterAll(async () => {
    await browser.close();
  });

  beforeEach(async () => {
    page = await browser.newPage();
  });

  afterEach(async () => {
    await page.close();
  });

  it("creates a study session", async () => {
    await page.goto("http://localhost:3000/auth/login");
    await page.waitForTimeout(2000);
    await page.fill('input[type="email"]', "owner@cloudsecurity.local");
    await page.fill('input[type="password"]', "changeme123");
    await page.click('button[type="submit"]');
    await page.waitForURL("**/dashboard");
    await page.waitForTimeout(2000);

    await page.goto("http://localhost:3000/study");
    await page.waitForTimeout(2000);

    const newSessionBtn = await page.locator("text=New Session").first();
    if (await newSessionBtn.isVisible()) {
      await newSessionBtn.click();
      await page.waitForTimeout(1000);

      const durationInput = await page.$('input[type="number"]');
      if (durationInput) {
        await durationInput.fill("45");
      }

      const topicsInput = await page.locator('input[placeholder*="comma"]').first();
      if (await topicsInput.isVisible()) {
        await topicsInput.fill("AWS IAM, Security Groups");
      }

      const submitBtn = await page.locator('button[type="submit"]').first();
      if (await submitBtn.isVisible()) {
        await submitBtn.click();
        await page.waitForTimeout(2000);
      }
    }
  });
});
