const { test, expect } = require("@playwright/test");
const baseURL = "http://localhost:3000";

async function login(page) {
  await page.goto(`${baseURL}/login`);
  await page.fill("input[name='email']", "peter@abv.bg");
  await page.fill("input[name='password']", "123456");
  await page.click("input[type='submit']");
}

async function register(page) {
  await page.goto(`${baseURL}/register`);
  await page.fill("input[name='email']", "george@gmail.com");
  await page.fill("input[name='password']", "123456");
  await page.fill("input[name='confirm-pass']", "123456");
  await page.click("input[type='submit']");
}

// Navigation

test('Verify "All Books" link is visible', async ({ page }) => {
  await page.goto("http://localhost:3000");
  await page.waitForSelector("nav.navbar");

  const allBooksLink = await page.$("a[href='/catalog']");
  const isLinkVisible = await allBooksLink.isVisible();

  expect(isLinkVisible).toBe(true);
});

test('Verify "Login" button is visible', async ({ page }) => {
  await page.goto(baseURL);
  await page.waitForSelector("nav.navbar");

  const loginButton = await page.$("a[href='/login']");
  const isLoginButtonVisible = await loginButton.isVisible();

  expect(isLoginButtonVisible).toBe(true);
});

test('Verify "Register" button is visible', async ({ page }) => {
  await page.goto(baseURL);
  await page.waitForSelector("nav.navbar");

  const registerButton = await page.$("a[href='/register']");
  const isRegisterButtonVisible = await registerButton.isVisible();

  expect(isRegisterButtonVisible).toBe(true);
});

test('Verify "All Books" link is visible after user login', async ({
  page,
}) => {
  await login(page);

  const allBooksLink = await page.$("a[href='/catalog']");
  const isAllBooksLinkVisible = await allBooksLink.isVisible();

  expect(isAllBooksLinkVisible).toBe(true);
});

test('Verify "Add Book" button is visible after user login', async ({
  page,
}) => {
  await login(page);

  const addBookButton = await page.$("a[href='/create']");
  const isAddBookButtonVisible = await addBookButton.isVisible();

  expect(isAddBookButtonVisible).toBe(true);
});

test("Verify user email address is visible after user login", async ({
  page,
}) => {
  await login(page);

  const userEmail = await page.$("#user span");
  const isUserEmailVisible = await userEmail.isVisible();

  expect(isUserEmailVisible).toBe(true);
});

// Login Page

test("Login with valid credentials", async ({ page }) => {
  await login(page);

  await page.waitForSelector("nav.navbar");
  expect(page.url()).toBe(`${baseURL}/catalog`);
});

test("Submit login form with empty fields", async ({ page }) => {
  page.on("dialog", async (dialog) => {
    expect(dialog.type()).toContain("alert");
    expect(dialog.message()).toContain("All fields are required!");
    await dialog.accept();
  });

  await page.goto(`${baseURL}/login`);
  await page.click("input[type='submit']");

  expect(page.url()).toBe(`${baseURL}/login`);
});

test("Submit login form with empty email field", async ({ page }) => {
  page.on("dialog", async (dialog) => {
    expect(dialog.type()).toContain("alert");
    expect(dialog.message()).toContain("All fields are required!");
    await dialog.accept();
  });

  await page.goto(`${baseURL}/login`);
  await page.fill("input[name='password']", "123456");
  await page.click("input[type='submit']");

  expect(page.url()).toBe(`${baseURL}/login`);
});

test("Submit login form with empty password field", async ({ page }) => {
  page.on("dialog", async (dialog) => {
    expect(dialog.type()).toContain("alert");
    expect(dialog.message()).toContain("All fields are required!");
    await dialog.accept();
  });

  await page.goto(`${baseURL}/login`);
  await page.fill("input[name='email']", "peter@abv.bg");
  await page.click("input[type='submit']");

  expect(page.url()).toBe(`${baseURL}/login`);
});

// Register Page

test("Register with valid credentials", async ({ page }) => {
  await register(page);

  await page.waitForSelector("nav.navbar");
  expect(page.url()).toBe(`${baseURL}/catalog`);
});

test("Submit register form with empty fields", async ({ page }) => {
  page.on("dialog", async (dialog) => {
    expect(dialog.type()).toContain("alert");
    expect(dialog.message()).toContain("All fields are required!");
    await dialog.accept();
  });

  await page.goto(`${baseURL}/register`);
  await page.click("input[type='submit']");

  expect(page.url()).toBe(`${baseURL}/register`);
});

test("Submit register form with empty email field", async ({ page }) => {
  page.on("dialog", async (dialog) => {
    expect(dialog.type()).toContain("alert");
    expect(dialog.message()).toContain("All fields are required!");
    await dialog.accept();
  });

  await page.goto(`${baseURL}/register`);
  await page.fill("input[name='password']", "123456");
  await page.fill("input[name='confirm-pass']", "123456");
  await page.click("input[type='submit']");

  expect(page.url()).toBe(`${baseURL}/register`);
});

test("Submit register form with empty password fields", async ({ page }) => {
  page.on("dialog", async (dialog) => {
    expect(dialog.type()).toContain("alert");
    expect(dialog.message()).toContain("All fields are required!");
    await dialog.accept();
  });

  await page.goto(`${baseURL}/register`);
  await page.fill("input[name='email']", "george@abv.bg");
  await page.click("input[type='submit']");

  expect(page.url()).toBe(`${baseURL}/register`);
});

test("Submit register form with different passwords", async ({ page }) => {
  page.on("dialog", async (dialog) => {
    expect(dialog.type()).toContain("alert");
    expect(dialog.message()).toContain("Passwords don't match!");
    await dialog.accept();
  });

  await page.goto(`${baseURL}/register`);
  await page.fill("input[name='email']", "george@abv.bg");
  await page.fill("input[name='password']", "123456");
  await page.fill("input[name='confirm-pass']", "654321");
  await page.click("input[type='submit']");

  expect(page.url()).toBe(`${baseURL}/register`);
});

// Add Book Page

test("Submit add book form with correct data", async ({ page }) => {
  await login(page);
  page.waitForURL(`${baseURL}/catalog`);
  await page.click("a[href='/create']");
  await page.waitForSelector("#create-form");

  await page.fill("#title", "Test Book");
  await page.fill("#description", "This is a test book description");
  await page.fill("#image", "https://example.com/book-image.jpg");
  await page.selectOption("#type", "Fiction");
  await page.click("#create-form input[type='submit']");

  await page.waitForURL(`${baseURL}/catalog`);
  expect(page.url()).toBe(`${baseURL}/catalog`);
});

test("Submit add book form with empty title field", async ({ page }) => {
  await login(page);
  page.waitForURL(`${baseURL}/catalog`);
  await page.click("a[href='/create']");
  await page.waitForSelector("#create-form");

  page.on("dialog", async (dialog) => {
    expect(dialog.type()).toContain("alert");
    expect(dialog.message()).toContain("All fields are required!");
    await dialog.accept();
  });

  await page.fill("#description", "This is a test book description");
  await page.fill("#image", "https://example.com/book-image.jpg");
  await page.selectOption("#type", "Fiction");
  await page.click("#create-form input[type='submit']");

  await page.$("nav.navbar");
  expect(page.url()).toBe(`${baseURL}/create`);
});

test("Submit add book form with empty description field", async ({ page }) => {
  await login(page);
  page.waitForURL(`${baseURL}/catalog`);
  await page.click("a[href='/create']");
  await page.waitForSelector("#create-form");

  page.on("dialog", async (dialog) => {
    expect(dialog.type()).toContain("alert");
    expect(dialog.message()).toContain("All fields are required!");
    await dialog.accept();
  });

  await page.fill("#title", "Test Book");
  await page.fill("#image", "https://example.com/book-image.jpg");
  await page.selectOption("#type", "Fiction");
  await page.click("#create-form input[type='submit']");

  await page.$("nav.navbar");
  expect(page.url()).toBe(`${baseURL}/create`);
});

test("Submit add book form with empty image field", async ({ page }) => {
  await login(page);
  page.waitForURL(`${baseURL}/catalog`);
  await page.click("a[href='/create']");
  await page.waitForSelector("#create-form");

  page.on("dialog", async (dialog) => {
    expect(dialog.type()).toContain("alert");
    expect(dialog.message()).toContain("All fields are required!");
    await dialog.accept();
  });

  await page.fill("#title", "Test Book");
  await page.fill("#description", "This is a test book description");
  await page.selectOption("#type", "Fiction");
  await page.click("#create-form input[type='submit']");

  await page.$("nav.navbar");
  expect(page.url()).toBe(`${baseURL}/create`);
});

// All Books Page

test("Login and verify all books are displayed", async ({ page }) => {
  await login(page);
  await page.waitForSelector(".dashboard");

  const bookElements = await page.$$(".other-books-list li");

  expect(bookElements.length).toBeGreaterThan(0);
});

// Delete books manually first
// test("Login, delete books and verify no books are displayed", async ({
//   page,
// }) => {
//   await login(page);
//   await page.goto(`${baseURL}/profile`);

//   const noBooksMessage = await page.textContent(".no-books");

//   expect(noBooksMessage).toBe("No books in database!");
// });

// Details Page

test("Login and navigate to Details page", async ({ page }) => {
  await login(page);
  await page.waitForURL(`${baseURL}/catalog`);
  await page.click("a[href='/catalog']");
  await page.waitForSelector(".otherBooks");
  await page.click(".otherBooks a.button");
  await page.waitForSelector(".book-information");

  const detailsPageTitle = await page.textContent(".book-information h3");

  expect(detailsPageTitle).toBe("Test Book");
});

test("Navigate to Details page", async ({ page }) => {
  await page.goto(`${baseURL}/catalog`);
  await page.waitForURL(`${baseURL}/catalog`);
  await page.click("a[href='/catalog']");
  await page.waitForSelector(".otherBooks");
  await page.click(".otherBooks a.button");
  await page.waitForSelector(".book-information");

  const detailsPageTitle = await page.textContent(".book-information h3");

  expect(detailsPageTitle).toBe("Test Book");
});

test("Validate book details", async ({ page }) => {
  await page.goto(`${baseURL}/catalog`);
  await page.waitForURL(`${baseURL}/catalog`);
  await page.click("a[href='/catalog']");
  await page.waitForSelector(".otherBooks");
  await page.click(".otherBooks a.button");
  await page.waitForSelector(".book-information");

  const detailsPageTitle = await page.textContent(".book-information h3");
  const detailsPageType = await page.textContent(".book-information .type");
  const detailsPageDescription = await page.textContent(".book-description p");

  expect(detailsPageTitle).toBe("Test Book");
  expect(detailsPageType).toBe("Type: Fiction");
  expect(detailsPageDescription).toBe("This is a test book description");
});

test("Validate book action buttons are visible for creator", async ({
  page,
}) => {
  await login(page);
  await page.waitForURL(`${baseURL}/catalog`);
  await page.click("a[href='/catalog']");
  await page.waitForSelector(".otherBooks");
  await page.click(".otherBooks a.button");
  await page.waitForSelector(".book-information");

  const [editButton, deleteButton] = await page.$$(".actions a.button");
  const editButtonText = await editButton.innerText();
  const deleteButtonText = await deleteButton.innerText();

  expect(editButtonText).toBe("Edit");
  expect(deleteButtonText).toBe("Delete");
});

test("Validate book action buttons are not visible for non-creator", async ({
  page,
}) => {
  await page.goto(`${baseURL}/catalog`);
  await page.waitForURL(`${baseURL}/catalog`);
  await page.click("a[href='/catalog']");
  await page.waitForSelector(".otherBooks");
  await page.click(".otherBooks a.button");
  await page.waitForSelector(".book-information");

  const bookActionButtons = await page.$$(".actions a.button");

  expect(bookActionButtons.length).toBe(0);
});

test("Validate like button is not visible for creator", async ({ page }) => {
  await login(page);
  await page.waitForURL(`${baseURL}/catalog`);
  await page.click("a[href='/catalog']");
  await page.waitForSelector(".otherBooks");
  await page.click(".otherBooks a.button");
  await page.waitForSelector(".book-information");

  const bookActionButtons = await page.$$(".actions a.button");
  const [editButton, deleteButton] = bookActionButtons;
  const editButtonText = await editButton.innerText();
  const deleteButtonText = await deleteButton.innerText();

  expect(editButtonText).toBe("Edit");
  expect(deleteButtonText).toBe("Delete");
  expect(bookActionButtons.length).toBe(2);
});

test("Validate like button is visible for non-creator", async ({ page }) => {
  await login(page);
  await page.waitForURL(`${baseURL}/catalog`);
  await page.click("a[href='/catalog']");
  await page.waitForSelector(".otherBooks");
  const allDetailButtons = await page.$$(".otherBooks a.button");
  await allDetailButtons[allDetailButtons.length - 3].click();
  await page.waitForSelector(".book-information");

  const likeButton = await page.$(".actions a.button");
  const likeButtonText = await likeButton.innerText();

  expect(likeButtonText).toBe("Like");
});

// Logout

test("Verify redirection of logout link after user login", async ({ page }) => {
  await login(page);
  const logoutLink = await page.$("a[href='javascript:void(0)']");

  await logoutLink.click();
  const redirectedURL = page.url();

  expect(redirectedURL).toBe(`${baseURL}/catalog`);
});
