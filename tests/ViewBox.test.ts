import { expect, test } from "@playwright/test";

// Go to main page and clear the default network
test.beforeEach(async ({ page }) => {
  await page.goto("/");

  page.on("dialog", (dialog) => {
    void dialog.accept();
  });

  const clear = page.getByRole("button", { name: "Clear" });
  await clear.click();
});

test("No router detected on empty canvas", async ({ page }) => {
  const target = page.locator("svg");

  const circle = target.locator("circle");
  const circleText = target.locator("text");

  await expect(circle).not.toBeVisible();
  await expect(circleText).not.toBeVisible();
});

test("Can drag and drop a CE Router", async ({ page }) => {
  const source = page.getByRole("button", { name: "+ Customer" });
  const target = page.locator("svg");

  await source.dragTo(target);

  const circle = target.locator("circle");
  const circleText = target.locator("text");

  await expect(circle).toBeVisible();
  await expect(circle).toHaveAttribute("fill", "lightgreen");
  await expect(circleText).toBeVisible();
  await expect(circleText).toContainText("CE");
});

test("Can drag and drop a LER Router", async ({ page }) => {
  const source = page.getByRole("button", { name: "+ Edge" });
  const target = page.locator("svg");

  await source.dragTo(target);

  const circle = target.locator("circle");
  const circleText = target.locator("text");

  await expect(circle).toBeVisible();
  await expect(circle).toHaveAttribute("fill", "cyan");
  await expect(circleText).toBeVisible();
  await expect(circleText).toContainText("LER");
});

test("Can drag and drop a LSR Router", async ({ page }) => {
  const source = page.getByRole("button", { name: "+ Switch" });
  const target = page.locator("svg");

  await source.dragTo(target);

  const circle = target.locator("circle");
  const circleText = target.locator("text");

  await expect(circle).toBeVisible();
  await expect(circle).toHaveAttribute("fill", "hotpink");
  await expect(circleText).toBeVisible();
  await expect(circleText).toContainText("LSR");
});

test("Can establish a connection between CE and LER", async ({ page }) => {
  const CustomerButton = page.getByRole("button", { name: "+ Customer" });
  const EdgeButton = page.getByRole("button", { name: "+ Edge" });
  const SVG = page.locator("svg");

  const SVGBoundingBox = await SVG.boundingBox();

  if (!SVGBoundingBox) throw new Error("Could not find SVG bounding box");

  const middle = {
    x: SVGBoundingBox.width / 2,
    y: SVGBoundingBox.height / 2,
  };

  await CustomerButton.dragTo(SVG, { targetPosition: { x: middle.x - 100, y: middle.y } });
  await EdgeButton.dragTo(SVG, { targetPosition: { x: middle.x + 100, y: middle.y } });

  const [CECircle, LERCircle] = await SVG.locator("circle").all();

  await page.keyboard.down("Shift");
  await CECircle.dragTo(LERCircle);
  // Drag it again because WebKit refuses to do it the first time
  await CECircle.dragTo(LERCircle);
  await page.keyboard.up("Shift");

  const connection = SVG.locator("line");
  const connectionBox = SVG.locator("rect");
  const connectionBoxText = SVG.locator("text").first();

  await expect(connection).toHaveAttribute("stroke", "black");
  await expect(connectionBox).toBeVisible();
  await expect(connectionBoxText).toContainText("0 km");
});
