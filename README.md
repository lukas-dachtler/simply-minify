# Simply-Minify
[![NPM version](https://img.shields.io/npm/v/simply-minify.svg?style=flat)]()
[![NPM Downloads](https://img.shields.io/npm/dt/simply-minify.svg)]()
#### Simply-Minify is a simple minifier for the [Node.js](http://nodejs.org/) platform. Simply-Minify finds all CSS and JS files in the given folder and minifies them.
### Dependencies:
NPM-Package|Version
---|---
**clean-css**|[![NPM version](https://img.shields.io/badge/npm-v4.2.1-blue.svg)](https://www.npmjs.com/package/clean-css)
**UglifyJS3**|[![NPM version](https://img.shields.io/badge/npm-v3.6.8-blue.svg)](https://www.npmjs.com/package/uglify-js)
# Install
```
npm i simply-minify -D
```
# Use
```js
const simplyMinify = require('simply-minify');
simplyMinify();
```
This will minify all files in the `"dist"` folder in the **root directory** of your app.
## Arguments
The function `simplyMinify` takes 3 arguments:

argument|data type|description|default|example
---|---|---|---|---
`dir`|`string`|directory to search for files|`"dist"`|*`"src/js"`*
`CleanCSS_Options`|`object`|[options for clean-css](https://github.com/jakubpawlowicz/clean-css/blob/master/README.md#constructor-options)|`{}`|*`{level: 0}`*
`UglifyJS_Options`|`object`|[options for UglifyJS3](https://github.com/mishoo/UglifyJS2#minify-options)|`{}`|*`{mangle: false}`*
## CLI mode
***Make sure you have installed the npm-package globally:*** `npm install simply-minify -g`

You can use Simply-Minify straight from the command line with:
```js
simplyMinify <path>
```
> *Options are not supported in CLI mode*
# License
Simply-Minify is released under the [MIT License](https://github.com/lukas-dachtler/simply-minify/blob/master/LICENSE.md).
