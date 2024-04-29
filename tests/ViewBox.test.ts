import { expect, test } from "@playwright/test";

// Go to main page and clear the default network
test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await page.waitForLoadState("domcontentloaded");
  await page.waitForSelector("svg");

  page.on("dialog", (dialog) => {
    void dialog.accept();
  });

  const clear = page.getByRole("button", { name: "Clear Network" });
  await clear.click();
});

test("No router detected on empty canvas", async ({ page }) => {
  const target = page.locator("svg");

  const routerIcon = target.locator("image");
  const routerIconText = target.locator("text");

  await expect(routerIcon).not.toBeVisible();
  await expect(routerIconText).not.toBeVisible();
});

test("Can drag and drop a CE Router", async ({ page }) => {
  const source = page.getByRole("button", { name: "+ Customer" });
  const target = page.locator("svg");

  await source.dragTo(target);

  const routerIcon = target.locator("image");
  const routerIconText = target.locator("text");

  await expect(routerIcon).toBeVisible();
  await expect(routerIconText).toBeVisible();
  await expect(routerIconText).toContainText("CE");
});

test("Can drag and drop a LER Router", async ({ page }) => {
  const source = page.getByRole("button", { name: "+ Edge" });
  const target = page.locator("svg");

  await source.dragTo(target);

  const routerIcon = target.locator("image");
  const routerIconText = target.locator("text");

  await expect(routerIcon).toBeVisible();
  await expect(routerIconText).toBeVisible();
  await expect(routerIconText).toContainText("LER");
});

test("Can drag and drop a LSR Router", async ({ page }) => {
  const source = page.getByRole("button", { name: "+ Switch" });
  const target = page.locator("svg");

  await source.dragTo(target);

  const routerIcon = target.locator("image");
  const routerIconText = target.locator("text");

  await expect(routerIcon).toBeVisible();
  await expect(routerIconText).toBeVisible();
  await expect(routerIconText).toContainText("LSR");
});

test("Cannot create a router when in edit mode", async ({ page }) => {
  const modeButton = page.getByRole("button", { name: "Simulation" });
  await modeButton.click();

  const draggables = page.locator("button[draggable]");
  await expect(draggables).toHaveCount(0);
});

test("Can establish a link between CE and LER", async ({ page }) => {
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

  const [CErouterIcon, LERrouterIcon] = await SVG.locator("image").all();

  await page.keyboard.down("Shift");
  await CErouterIcon.dragTo(LERrouterIcon);
  await page.keyboard.up("Shift");

  const link = SVG.locator("line");
  const linkBox = SVG.locator("rect");
  const linkBoxText = SVG.locator("text").first();

  // toBeVisible for link does not work in Chrome? But this gives the same result
  await expect(link).toHaveAttribute("x1");
  await expect(linkBox).toBeVisible();
  await expect(linkBoxText).toContainText("0 km");
});

test("Can establish a link between LER and LSR", async ({ page }) => {
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

  const [LERrouterIcon, LSRrouterIcon] = await SVG.locator("image").all();

  await page.keyboard.down("Shift");
  await LERrouterIcon.dragTo(LSRrouterIcon);
  await page.keyboard.up("Shift");

  const link = SVG.locator("line");
  const linkBox = SVG.locator("rect");
  const linkBoxText = SVG.locator("text").first();

  // toBeVisible for link does not work in Chrome? But this gives the same result
  await expect(link).toHaveAttribute("x1");
  await expect(linkBox).toBeVisible();
  await expect(linkBoxText).toContainText("0 km");
});

test("Can establish a link between LSR and LSR", async ({ page }) => {
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

  const [LSRrouterIcon1, LSRrouterIcon2] = await SVG.locator("image").all();

  await page.keyboard.down("Shift");
  await LSRrouterIcon1.dragTo(LSRrouterIcon2);
  await page.keyboard.up("Shift");

  const link = SVG.locator("line");
  const linkBox = SVG.locator("rect");
  const linkBoxText = SVG.locator("text").first();

  // toBeVisible for link does not work in Chrome? But this gives the same result
  await expect(link).toHaveAttribute("x1");
  await expect(linkBox).toBeVisible();
  await expect(linkBoxText).toContainText("0 km");
});

test("Cannot establish a link between CE and CE", async ({ page }) => {
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

  const [CErouterIcon1, CErouterIcon2] = await SVG.locator("image").all();

  await page.keyboard.down("Shift");
  await CErouterIcon1.dragTo(CErouterIcon2);
  await page.keyboard.up("Shift");

  const link = SVG.locator("line");
  const linkBox = SVG.locator("rect");

  await expect(link).not.toBeVisible();
  await expect(linkBox).not.toBeVisible();
});

test("Cannot establish a link between CE and LSR", async ({ page }) => {
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

  const [CErouterIcon, LSRrouterIcon] = await SVG.locator("image").all();

  await page.keyboard.down("Shift");
  await CErouterIcon.dragTo(LSRrouterIcon);
  await page.keyboard.up("Shift");

  const link = SVG.locator("line");
  const linkBox = SVG.locator("rect");

  await expect(link).not.toBeVisible();
  await expect(linkBox).not.toBeVisible();
});

test("Cannot establish a link between LER and LER", async ({ page }) => {
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

  const [LERrouterIcon1, LERrouterIcon2] = await SVG.locator("image").all();

  await page.keyboard.down("Shift");
  await LERrouterIcon1.dragTo(LERrouterIcon2);
  await page.keyboard.up("Shift");

  const link = SVG.locator("line");
  const linkBox = SVG.locator("rect");

  await expect(link).not.toBeVisible();
  await expect(linkBox).not.toBeVisible();
});

test("Cannot create a link when in simulation mode", async ({ page }) => {
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

  const [CErouterIcon, LERrouterIcon] = await SVG.locator("image").all();

  const modeButton = page.getByRole("button", { name: "Simulation" });
  await modeButton.click();

  await page.keyboard.down("Shift");
  await CErouterIcon.dragTo(LERrouterIcon);
  await page.keyboard.up("Shift");

  const link = SVG.locator("line");
  const linkBox = SVG.locator("rect");

  await expect(link).not.toBeVisible();
  await expect(linkBox).not.toBeVisible();
});

test("Can change label on a CE router", async ({ page }) => {
  const CustomerButton = page.getByRole("button", { name: "+ Customer" });
  const SVG = page.locator("svg");

  await CustomerButton.dragTo(SVG);

  const CErouterIcon = SVG.locator("image");
  const CErouterIconText = SVG.locator("text");

  await CErouterIcon.dblclick();

  const input = page.getByLabel("Label:");

  const newLabel = "Mr. Topholt";

  await input.fill(newLabel);
  await page.keyboard.press("Escape");
  await expect(CErouterIconText).toContainText(newLabel);
});

test("Can change label on a LER router", async ({ page }) => {
  const EdgeButton = page.getByRole("button", { name: "+ Edge" });
  const SVG = page.locator("svg");

  await EdgeButton.dragTo(SVG);

  const CErouterIcon = SVG.locator("image");
  const CErouterIconText = SVG.locator("text");

  await CErouterIcon.dblclick();

  const input = page.getByLabel("Label:");

  const newLabel = "Mr. Topholt";

  await input.fill(newLabel);
  await page.keyboard.press("Escape");
  await expect(CErouterIconText).toContainText(newLabel);
});

test("Can change label on a LSR router", async ({ page }) => {
  const SwitchButton = page.getByRole("button", { name: "+ Switch" });
  const SVG = page.locator("svg");

  await SwitchButton.dragTo(SVG);

  const CErouterIcon = SVG.locator("image");
  const CErouterIconText = SVG.locator("text");

  await CErouterIcon.dblclick();

  const input = page.getByLabel("Label:");

  const newLabel = "Mr. Topholt";

  await input.fill(newLabel);
  await page.keyboard.press("Escape");
  await expect(CErouterIconText).toContainText(newLabel);
});

test("Can delete a CE router", async ({ page }) => {
  const source = page.getByRole("button", { name: "+ Customer" });
  const target = page.locator("svg");

  await source.dragTo(target);

  const routerIcon = target.locator("image");

  await routerIcon.dblclick();

  const dialog = page.locator("dialog[open]").first();

  await dialog.getByRole("button", { name: "Delete Router" }).click();
  await page.keyboard.press("Escape");

  await expect(routerIcon).not.toBeVisible();
});

test("Can delete a LER router", async ({ page }) => {
  const source = page.getByRole("button", { name: "+ Edge" });
  const target = page.locator("svg");

  await source.dragTo(target);

  const routerIcon = target.locator("image");

  await routerIcon.dblclick();

  const dialog = page.locator("dialog[open]").first();

  await dialog.getByRole("button", { name: "Delete Router" }).click();
  await page.keyboard.press("Escape");

  await expect(routerIcon).not.toBeVisible();
});

test("Can delete a LSR router", async ({ page }) => {
  const source = page.getByRole("button", { name: "+ Switch" });
  const target = page.locator("svg");

  await source.dragTo(target);

  const routerIcon = target.locator("image");

  await routerIcon.dblclick();

  const dialog = page.locator("dialog[open]").first();

  await dialog.getByRole("button", { name: "Delete Router" }).click();
  await page.keyboard.press("Escape");

  await expect(routerIcon).not.toBeVisible();
});

test("Can delete a link", async ({ page }) => {
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

  const [CErouterIcon, LERrouterIcon] = await SVG.locator("image").all();

  await page.keyboard.down("Shift");
  await CErouterIcon.dragTo(LERrouterIcon);
  await page.keyboard.up("Shift");

  const link = SVG.locator("line");
  const linkBox = SVG.locator("rect");

  await linkBox.dblclick();

  const dialog = page.locator("dialog[open]").first();

  await dialog.getByRole("button", { name: "Delete Link" }).click();
  await page.keyboard.press("Escape");

  await expect(link).not.toBeVisible();
  await expect(linkBox).not.toBeVisible();
});

test("Can pan the viewbox when in edit mode", async ({ page }) => {
  const DRAG_DISTANCE = 100;
  const SVG = page.locator("svg");

  const SVGBoundingBox = await SVG.boundingBox();
  if (!SVGBoundingBox) throw new Error("Could not find SVG bounding box");

  const middle = {
    x: SVGBoundingBox.width / 2,
    y: SVGBoundingBox.height / 2,
  };

  const initialViewBox = await SVG.getAttribute("viewBox");
  if (!initialViewBox) throw new Error("Could not get initial viewbox");

  const initialViewBoxValues = initialViewBox.split(" ").map(Number);

  const expectedViewBoxValues = initialViewBoxValues.map((value, index) =>
    index < 2 ? value - DRAG_DISTANCE : value,
  );
  const expectedViewBox = expectedViewBoxValues.join(" ");

  await SVG.dragTo(SVG, {
    targetPosition: { x: middle.x + DRAG_DISTANCE, y: middle.y + DRAG_DISTANCE },
  });

  const newViewBox = await SVG.getAttribute("viewBox");
  if (!newViewBox) throw new Error("Could not get new viewbox");

  expect(newViewBox).toBe(expectedViewBox);
});

test("Can pan the viewbox when in simulation mode", async ({ page }) => {
  const modeButton = page.getByRole("button", { name: "Simulation" });
  await modeButton.click();

  await page.waitForTimeout(1000);

  const DRAG_DISTANCE = 100;
  const SVG = page.locator("svg");

  const SVGBoundingBox = await SVG.boundingBox();
  if (!SVGBoundingBox) throw new Error("Could not find SVG bounding box");

  const middle = {
    x: SVGBoundingBox.width / 2,
    y: SVGBoundingBox.height / 2,
  };

  const oldViewBox = await SVG.getAttribute("viewBox");
  if (!oldViewBox) throw new Error("Could not get old values");

  await SVG.dragTo(SVG, {
    targetPosition: { x: middle.x + DRAG_DISTANCE, y: middle.y + DRAG_DISTANCE },
  });

  const newViewBox = await SVG.getAttribute("viewBox");
  if (!newViewBox) throw new Error("Could not get new viewbox");

  expect(newViewBox).not.toEqual(oldViewBox);
});

test("Can zoom the viewbox when in edit mode", async ({ page }) => {
  const SVG = page.locator("svg");

  const SVGBoundingBox = await SVG.boundingBox();
  if (!SVGBoundingBox) throw new Error("Could not find SVG bounding box");

  const middle = {
    x: SVGBoundingBox.width / 2,
    y: SVGBoundingBox.height / 2,
  };

  const oldViewBox = await SVG.getAttribute("viewBox");
  if (!oldViewBox) throw new Error("Could not get old viewbox");

  await SVG.dispatchEvent("wheel", { deltaY: -1, clientX: middle.x, clientY: middle.y });

  const newViewBox = await SVG.getAttribute("viewBox");
  if (!newViewBox) throw new Error("Could not get new viewbox");

  expect(newViewBox).not.toEqual(oldViewBox);
});

test("Can zoom the viewbox when in simulation mode", async ({ page }) => {
  const modeButton = page.getByRole("button", { name: "Simulation" });
  await modeButton.click();

  const SVG = page.locator("svg");

  const SVGBoundingBox = await SVG.boundingBox();
  if (!SVGBoundingBox) throw new Error("Could not find SVG bounding box");

  const middle = {
    x: SVGBoundingBox.width / 2,
    y: SVGBoundingBox.height / 2,
  };

  const oldViewBox = await SVG.getAttribute("viewBox");
  if (!oldViewBox) throw new Error("Could not get old viewbox");

  await SVG.dispatchEvent("wheel", { deltaY: -1, clientX: middle.x, clientY: middle.y });

  const newViewBox = await SVG.getAttribute("viewBox");
  if (!newViewBox) throw new Error("Could not get new viewbox");

  expect(newViewBox).not.toEqual(oldViewBox);
});

test("Can move a router when in edit mode", async ({ page }) => {
  const source = page.getByRole("button", { name: "+ Customer" });
  const SVG = page.locator("svg");

  await source.dragTo(SVG);

  const routerIcon = SVG.locator("image");

  const oldPosition = await routerIcon.boundingBox();

  if (!oldPosition) throw new Error("Could not find old position");

  await routerIcon.dragTo(SVG, { targetPosition: { x: 100, y: 100 } });

  const newPosition = await routerIcon.boundingBox();

  if (!newPosition) throw new Error("Could not find new position");

  expect(newPosition).not.toEqual(oldPosition);
});

test("Cannot move a router when in edit mode", async ({ page }) => {
  const source = page.getByRole("button", { name: "+ Customer" });
  const SVG = page.locator("svg");

  await source.dragTo(SVG);

  const routerIcon = SVG.locator("image");

  const oldPosition = await routerIcon.getAttribute("cx");

  if (!oldPosition) throw new Error("Could not find old position");

  const modeButton = page.getByRole("button", { name: "Simulation" });
  await modeButton.click();

  await routerIcon.dragTo(SVG, { targetPosition: { x: 100, y: 0 } });

  const newPosition = await routerIcon.getAttribute("cx");

  if (!newPosition) throw new Error("Could not find new position");

  expect(newPosition).toEqual(oldPosition);
});
