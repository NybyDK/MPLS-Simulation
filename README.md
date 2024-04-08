![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/NybyDK/MPLS-Simulation/.github%2Fworkflows%2Fgithub-pages.yml?style=for-the-badge&label=GH%20Pages&labelColor=%230f0f0f)
![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/NybyDK/MPLS-Simulation/.github%2Fworkflows%2Flint.yml?style=for-the-badge&label=Lint&labelColor=%230f0f0f)
![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/NybyDK/MPLS-Simulation/.github%2Fworkflows%2Ftest-integration.yml?style=for-the-badge&label=Integration&labelColor=%230f0f0f)
![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/NybyDK/MPLS-Simulation/.github%2Fworkflows%2Ftest-unit.yml?style=for-the-badge&label=Unit&labelColor=%230f0f0f)

## MPLS Simulation

MPLS Network Simulations without any Simulations so far

## Developing

Install dependencies with `yarn` and start a development server:

```
yarn dev

# or start the server and open the app in a new browser tab
yarn dev --open

# or start the server and expose the port (e.g. for VS Code Live Share)
yarn dev --host
```

## Building

Build a production version of your app with `yarn build` and preview the build with `yarn preview`

## Testing

Run all tests:

```
yarn test

# or run integration tests (in UI mode)
yarn test:integration --ui

# or run unit tests (in UI mode)
yarn test:unit --ui
```
