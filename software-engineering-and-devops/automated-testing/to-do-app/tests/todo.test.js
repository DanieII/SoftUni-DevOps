const { test, expect } = require("@playwright/test");
const taskName = "Test Task";

async function addTask(page) {
  await page.goto("http://127.0.0.1:8080");
  await page.fill("#task-input", taskName);
  await page.click("#add-task");
}

test("user can add a task", async ({ page }) => {
  await addTask(page);

  const taskText = await page.textContent(".task");

  expect(taskText).toContain(taskName);
});

test("user can  delete a task", async ({ page }) => {
  await addTask(page);
  await page.click(".task .delete-task");

  const tasks = await page.$$eval(".task", (tasks) =>
    tasks.map((task) => task.textContent),
  );

  expect(tasks).not.toContain(taskName);
});

test("user can mark task as completed", async ({ page }) => {
  await addTask(page);
  await page.click(".task .task-complete");

  const completedTask = await page.$(".task.completed");

  expect(completedTask).not.toBeNull();
});

test("user can filter tasks", async ({ page }) => {
  await addTask(page);
  await page.click(".task .task-complete");
  await page.selectOption("#filter", "Completed");

  const incompleteTask = await page.$(".task:not(.completed)");

  expect(incompleteTask).toBeNull();
});
