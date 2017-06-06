# guld-app

Guld app, filling in the gaps with our gapp.

### Tests

There are two types of tests, attended and unattended. The latter is normal, automatable unit testing. The prior involves very long tasks and password entry, especially for key generation.

``` bash
npm run test-attended
# or
npm run test
```

### Build

This library uses es6, and requires babel to be run before node, or mocha can import it. The test scripts in `package.json` do this automatically.

``` bash
npm run build
```
