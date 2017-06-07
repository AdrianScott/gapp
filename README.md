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

### Usage

``` javascript
const gapp = require('gapp')
var perspective = new gapp.perspective.Perspective()
```

##### Initialize

Initialization is a complex process, behind the scenes.

1. initialize new git repo at `~/blocktree/`
2. make `~/blocktree/life/${name}/gap.json`
3. import or generate PGP key
4. export PGP public key to `~/blocktree/keys/pgp/${name}.asc`
5. log user into github once, to generate re-usable OAUTH token
6. Encrypt token and store in `~/blocktree/config.json`
7. add `~/blocktree/.gitignore` with `config.json*`
8. Commit all of the above.
9. Push to your github

From code, initialization is quite easy, at least in theory.

``` javascript
const gapp = require('gapp')
gapp.perspective.Perspective.init(
  github_username,
  github_password,
  email,
  fingerprint
)
```

### Config file

An encrypted config file is managed by the program, kept in `~/blocktree/config.json`. By default, this file is ignored by git. This file can be used for keeping secrets needed at runtime, such as authentication tokens for github and other services.
