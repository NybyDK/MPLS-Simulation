import type { PlaywrightTestConfig } from "@playwright/test";
import { devices } from "@playwright/test";

const config: PlaywrightTestConfig = {
  workers: 1,
  webServer: {
    command: "yarn build && yarn preview",
    port: 4173,
    timeout: 10 * 60 * 1000,
  },
  testDir: "tests",
  testMatch: /(.+\.)?test\.ts/,
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },
    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
    },
  ],
};

export default config;
