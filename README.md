[![telemetry-client](https://img.shields.io/endpoint?url=https://dashboard.cypress.io/badge/detailed/mxo83i/main&style=flat&logo=cypress)](https://dashboard.cypress.io/projects/mxo83i/runs) [![CI](https://github.com/unlikelyzero/openmct-e2e/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/unlikelyzero/openmct-e2e/actions/workflows/ci.yml)

# Open MCT telemetry client e2e tests

This repo contains two tests which automatically verify the functionality for the [telemetry-client](https://github.com/shefalijoshi/telemetry-client) and [openmct-tutorial](https://github.com/nasa/openmct-tutorial.git) applications.

## Prerequisites

In order to run the tests, you must first set up the target environment by following the steps
outlined [here](https://github.com/shefalijoshi/telemetry-client#telemetry-client)

Once you have verified that the client is launched, you can install and run the tests in this repo.

## Installation

```
git clone https://github.com/unlikelyzero/openmct-e2e.git
npm install
```

After this test repo is installed, you can decide whether you want to run all the tests at once headlessly, 
or run the tests with the Cypress GUI Playground.

## Run Headless

```
npm run headless
```

## Run Cypress GUI Playground

```
npm run cypress
```


## Reports

Reports for the tests are located in the `results/` folder by testsuite name.

## Tests

Tests are located in the `/cypress/integration` folder.

Each Requirement is configured as a test suite with a Function, Negative, and Non-functional context.
The automated Testcases are included in the testsuite and are associated identifiable as 
```
OPENMCT-<n>-<type>-<number>
```
