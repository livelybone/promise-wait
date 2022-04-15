# @livelybone/promise-wait
[![NPM Version](http://img.shields.io/npm/v/@livelybone/promise-wait.svg?style=flat-square)](https://www.npmjs.com/package/@livelybone/promise-wait)
[![Download Month](http://img.shields.io/npm/dm/@livelybone/promise-wait.svg?style=flat-square)](https://www.npmjs.com/package/@livelybone/promise-wait)
![gzip with dependencies: kb](https://img.shields.io/badge/gzip--with--dependencies-kb-brightgreen.svg "gzip with dependencies: kb")
![typescript](https://img.shields.io/badge/typescript-supported-blue.svg "typescript")
![pkg.module](https://img.shields.io/badge/pkg.module-supported-blue.svg "pkg.module")

> `pkg.module supported`, which means that you can apply tree-shaking in you project

[中文文档](./README-CN.md)

A lib with some method about wait apis, including wait, waitUntil

## repository
git@github.com:livelybone/promise-wait.git

## Demo
https://github.com/livelybone/promise-wait@readme

## Run Example
you can see the usage by run the example of the module, here is the step:

1. Clone the library `git clone git@github.com:livelybone/promise-wait.git`
2. Go to the directory `cd [the-module-directory]`
3. Install npm dependencies `npm i`(use taobao registry: `npm i --registry=http://registry.npm.taobao.org`)
4. Open service `npm run dev`
5. See the example(usually is `http://127.0.0.1:3000/examples/test.html`) in your browser

## Installation
```bash
npm i -S @livelybone/promise-wait
```

## Global name - The variable the module exported in `umd` bundle
`PromiseWait`

## Interface
See what method or params you can use in [index.d.ts](./index.d.ts)

## Usage
```js
import { wait, waitUntil } from '@livelybone/promise-wait'

async function fn() {
  await wait(2000)

  await waitUntil(info => info.count > 5)

  await waitUntil(info => info.passedTime > 5000)
}
```

## CDN
Use in html, see what you can use in [CDN: unpkg](https://unpkg.com/@livelybone/promise-wait/lib/umd/)
```html
<-- use what you want -->
<script src="https://unpkg.com/@livelybone/promise-wait/lib/umd/<--module-->.js"></script>
```

Or，see what you can use in [CDN: jsdelivr](https://cdn.jsdelivr.net/npm/@livelybone/promise-wait/lib/umd/)
```html
<script src="https://cdn.jsdelivr.net/npm/@livelybone/promise-wait/lib/umd/<--module-->.js"></script>
```
