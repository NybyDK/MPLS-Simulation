import { expect, test } from "@playwright/test";

// Go to main page and clear the default network
test.beforeEach(async ({ page }) => {
  await page.goto("/");

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

test("Can establish a connection between LER and LSR", async ({ page }) => {
  const EdgeButton = page.getByRole("button", { name: "+ Edge" });
  const SwitchButton = page.getByRole("button", { name: "+ Switch" });
  const SVG = page.locator("svg");

  const SVGBoundingBox = await SVG.boundingBox();

  if (!SVGBoundingBox) throw new Error("Could not find SVG bounding box");

  const middle = {
    x: SVGBoundingBox.width / 2,
    y: SVGBoundingBox.height / 2,
  };

  await EdgeButton.dragTo(SVG, { targetPosition: { x: middle.x - 100, y: middle.y } });
  await SwitchButton.dragTo(SVG, { targetPosition: { x: middle.x + 100, y: middle.y } });

  const [LERCircle, LSRCircle] = await SVG.locator("circle").all();

  await page.keyboard.down("Shift");
  await LERCircle.dragTo(LSRCircle);
  // Drag it again because WebKit refuses to do it the first time
  await LERCircle.dragTo(LSRCircle);
  await page.keyboard.up("Shift");

  const connection = SVG.locator("line");
  const connectionBox = SVG.locator("rect");
  const connectionBoxText = SVG.locator("text").first();

  await expect(connection).toHaveAttribute("stroke", "black");
  await expect(connectionBox).toBeVisible();
  await expect(connectionBoxText).toContainText("0 km");
});

test("Can establish a connection between LSR and LSR", async ({ page }) => {
  const SwitchButton = page.getByRole("button", { name: "+ Switch" });
  const SVG = page.locator("svg");

  const SVGBoundingBox = await SVG.boundingBox();

  if (!SVGBoundingBox) throw new Error("Could not find SVG bounding box");

  const middle = {
    x: SVGBoundingBox.width / 2,
    y: SVGBoundingBox.height / 2,
  };

  await SwitchButton.dragTo(SVG, { targetPosition: { x: middle.x - 100, y: middle.y } });
  await SwitchButton.dragTo(SVG, { targetPosition: { x: middle.x + 100, y: middle.y } });

  const [LSRCircle1, LSRCircle2] = await SVG.locator("circle").all();

  await page.keyboard.down("Shift");
  await LSRCircle1.dragTo(LSRCircle2);
  // Drag it again because WebKit refuses to do it the first time
  await LSRCircle1.dragTo(LSRCircle2);
  await page.keyboard.up("Shift");

  const connection = SVG.locator("line");
  const connectionBox = SVG.locator("rect");
  const connectionBoxText = SVG.locator("text").first();

  await expect(connection).toHaveAttribute("stroke", "black");
  await expect(connectionBox).toBeVisible();
  await expect(connectionBoxText).toContainText("0 km");
});

test("Cannot establish a connection between CE and CE", async ({ page }) => {
  const CustomerButton = page.getByRole("button", { name: "+ Customer" });
  const SVG = page.locator("svg");

  const SVGBoundingBox = await SVG.boundingBox();

  if (!SVGBoundingBox) throw new Error("Could not find SVG bounding box");

  const middle = {
    x: SVGBoundingBox.width / 2,
    y: SVGBoundingBox.height / 2,
  };

  await CustomerButton.dragTo(SVG, { targetPosition: { x: middle.x - 100, y: middle.y } });
  await CustomerButton.dragTo(SVG, { targetPosition: { x: middle.x + 100, y: middle.y } });

  const [CECircle1, CECircle2] = await SVG.locator("circle").all();

  await page.keyboard.down("Shift");
  await CECircle1.dragTo(CECircle2);
  // Drag it again because WebKit refuses to do it the first time
  await CECircle1.dragTo(CECircle2);
  await page.keyboard.up("Shift");

  const connection = SVG.locator("line");
  const connectionBox = SVG.locator("rect");

  await expect(connection).not.toBeVisible();
  await expect(connectionBox).not.toBeVisible();
});

test("Cannot establish a connection between CE and LSR", async ({ page }) => {
  const CustomerButton = page.getByRole("button", { name: "+ Customer" });
  const SwitchButton = page.getByRole("button", { name: "+ Switch" });
  const SVG = page.locator("svg");

  const SVGBoundingBox = await SVG.boundingBox();

  if (!SVGBoundingBox) throw new Error("Could not find SVG bounding box");

  const middle = {
    x: SVGBoundingBox.width / 2,
    y: SVGBoundingBox.height / 2,
  };

  await CustomerButton.dragTo(SVG, { targetPosition: { x: middle.x - 100, y: middle.y } });
  await SwitchButton.dragTo(SVG, { targetPosition: { x: middle.x + 100, y: middle.y } });

  const [CECircle, LSRCircle] = await SVG.locator("circle").all();

  await page.keyboard.down("Shift");
  await CECircle.dragTo(LSRCircle);
  // Drag it again because WebKit refuses to do it the first time
  await CECircle.dragTo(LSRCircle);
  await page.keyboard.up("Shift");

  const connection = SVG.locator("line");
  const connectionBox = SVG.locator("rect");

  await expect(connection).not.toBeVisible();
  await expect(connectionBox).not.toBeVisible();
});

test("Cannot establish a connection between LER and LER", async ({ page }) => {
  const EdgeButton = page.getByRole("button", { name: "+ Edge" });
  const SVG = page.locator("svg");

  const SVGBoundingBox = await SVG.boundingBox();

  if (!SVGBoundingBox) throw new Error("Could not find SVG bounding box");

  const middle = {
    x: SVGBoundingBox.width / 2,
    y: SVGBoundingBox.height / 2,
  };

  await EdgeButton.dragTo(SVG, { targetPosition: { x: middle.x - 100, y: middle.y } });
  await EdgeButton.dragTo(SVG, { targetPosition: { x: middle.x + 100, y: middle.y } });

  const [LERCircle1, LERCircle2] = await SVG.locator("circle").all();

  await page.keyboard.down("Shift");
  await LERCircle1.dragTo(LERCircle2);
  // Drag it again because WebKit refuses to do it the first time
  await LERCircle1.dragTo(LERCircle2);
  await page.keyboard.up("Shift");

  const connection = SVG.locator("line");
  const connectionBox = SVG.locator("rect");

  await expect(connection).not.toBeVisible();
  await expect(connectionBox).not.toBeVisible();
});

test("Can change label on a CE router", async ({ page }) => {
  const CustomerButton = page.getByRole("button", { name: "+ Customer" });
  const SVG = page.locator("svg");

  await CustomerButton.dragTo(SVG);

  const CECircle = SVG.locator("circle");
  const CECircleText = SVG.locator("text");

  await CECircle.dblclick();

  const dialog = page.locator("dialog[open]").first();
  const input = dialog.locator("input").first();

  const newLabel = "Mr. Topholt";

  await input.fill(newLabel);
  await page.keyboard.press("Escape");
  await expect(CECircleText).toContainText(newLabel);
});

test("Can change label on a LER router", async ({ page }) => {
  const EdgeButton = page.getByRole("button", { name: "+ Edge" });
  const SVG = page.locator("svg");

  await EdgeButton.dragTo(SVG);

  const CECircle = SVG.locator("circle");
  const CECircleText = SVG.locator("text");

  await CECircle.dblclick();

  const dialog = page.locator("dialog[open]").first();
  const input = dialog.locator("input").first();

  const newLabel = "Mr. Topholt";

  await input.fill(newLabel);
  await page.keyboard.press("Escape");
  await expect(CECircleText).toContainText(newLabel);
});

test("Can change label on a LSR router", async ({ page }) => {
  const SwitchButton = page.getByRole("button", { name: "+ Switch" });
  const SVG = page.locator("svg");

  await SwitchButton.dragTo(SVG);

  const CECircle = SVG.locator("circle");
  const CECircleText = SVG.locator("text");

  await CECircle.dblclick();

  const dialog = page.locator("dialog[open]").first();
  const input = dialog.locator("input").first();

  const newLabel = "Mr. Topholt";

  await input.fill(newLabel);
  await page.keyboard.press("Escape");
  await expect(CECircleText).toContainText(newLabel);
});

test("Can change distance on a connection", async ({ page }) => {
  const EdgeButton = page.getByRole("button", { name: "+ Edge" });
  const SwitchButton = page.getByRole("button", { name: "+ Switch" });
  const SVG = page.locator("svg");

  const SVGBoundingBox = await SVG.boundingBox();

  if (!SVGBoundingBox) throw new Error("Could not find SVG bounding box");

  const middle = {
    x: SVGBoundingBox.width / 2,
    y: SVGBoundingBox.height / 2,
  };

  await EdgeButton.dragTo(SVG, { targetPosition: { x: middle.x - 100, y: middle.y } });
  await SwitchButton.dragTo(SVG, { targetPosition: { x: middle.x + 100, y: middle.y } });

  const [LERCircle, LSRCircle] = await SVG.locator("circle").all();

  await page.keyboard.down("Shift");
  await LERCircle.dragTo(LSRCircle);
  // Drag it again because WebKit refuses to do it the first time
  await LERCircle.dragTo(LSRCircle);
  await page.keyboard.up("Shift");

  const connectionBox = SVG.locator("rect");
  const connectionBoxText = SVG.locator("text").first();

  await connectionBox.dblclick();

  const dialog = page.locator("dialog[open]").first();
  const input = dialog.locator("input").nth(1);

  const newDistance = "1000";

  await page.waitForTimeout(1000);
  await input.fill(newDistance);
  await page.waitForTimeout(1000);
  await page.keyboard.press("Escape");
  await page.waitForTimeout(1000);
  await expect(connectionBoxText).toContainText(newDistance + " km");
  await page.waitForTimeout(1000);
});

test("Can delete a CE router", async ({ page }) => {
  const source = page.getByRole("button", { name: "+ Customer" });
  const target = page.locator("svg");

  await source.dragTo(target);

  const circle = target.locator("circle");

  await circle.dblclick();

  const dialog = page.locator("dialog[open]").first();

  await dialog.getByRole("button", { name: "Delete Router" }).click();
  await page.keyboard.press("Escape");

  await expect(circle).not.toBeVisible();
});

test("Can delete a LER router", async ({ page }) => {
  const source = page.getByRole("button", { name: "+ Edge" });
  const target = page.locator("svg");

  await source.dragTo(target);

  const circle = target.locator("circle");

  await circle.dblclick();

  const dialog = page.locator("dialog[open]").first();

  await dialog.getByRole("button", { name: "Delete Router" }).click();
  await page.keyboard.press("Escape");

  await expect(circle).not.toBeVisible();
});

test("Can delete a LSR router", async ({ page }) => {
  const source = page.getByRole("button", { name: "+ Switch" });
  const target = page.locator("svg");

  await source.dragTo(target);

  const circle = target.locator("circle");

  await circle.dblclick();

  const dialog = page.locator("dialog[open]").first();

  await dialog.getByRole("button", { name: "Delete Router" }).click();
  await page.keyboard.press("Escape");

  await expect(circle).not.toBeVisible();
});

test("Can delete a connection", async ({ page }) => {
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

  await connectionBox.dblclick();

  const dialog = page.locator("dialog[open]").first();

  await dialog.getByRole("button", { name: "Delete Connection" }).click();
  await page.keyboard.press("Escape");

  await expect(connection).not.toBeVisible();
  await expect(connectionBox).not.toBeVisible();
});
