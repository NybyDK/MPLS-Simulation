import { expect, test } from "@playwright/test";

test("Homepage has MPLS in title", async ({ page }) => {
	await page.goto("/");
	expect(await page.title()).toContain("MPLS");
});
