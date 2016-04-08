# node-red-contrib-get-feeds

[![Build status][travis-image]][travis-url] [![Coverage Status][coveralls-image]][coveralls-url] [![NPM version][npm-image]][npm-url] [![XO code style][codestyle-image]][codestyle-url]

> A Node-RED node to get all feeds from an HTML string

A node that extracts any <code>&lt;link rel=&quot;alternate&quot; ...&gt;</code> that points to
a RSS, Atom or ActivityStream feed from the input <code>payload</code>.

## Installation

Install `node-red-contrib-get-feeds` using [npm](https://www.npmjs.com/):

```bash
npm install --save node-red-contrib-get-feeds
```

## Usage

To use the node, launch Node-RED (see [running Node-RED](http://nodered.org/docs/getting-started/running.html) for help getting started).

The input payload should be the HTML to get feeds from.

Any found feeds will be attached as the array <code>feeds</code> on the output message.
If the option <code>One feed/msg</code> is checked there will be one message sent per feed,
and the output message will contain a <code>feed</code> property instead of <code>feeds</code>.

If the input message contains a <code>url</code> property it will be used as
the <code>url</code> option for <a href="https://www.npmjs.com/package/get-feeds"><code>get-feeds</code></a> under the hood.

## License

MIT © [Joakim Carlstein](http://joakim.beng.se)

[npm-url]: https://npmjs.org/package/node-red-contrib-get-feeds
[npm-image]: https://badge.fury.io/js/node-red-contrib-get-feeds.svg
[travis-url]: https://travis-ci.org/joakimbeng/node-red-contrib-get-feeds
[travis-image]: https://travis-ci.org/joakimbeng/node-red-contrib-get-feeds.svg?branch=master
[coveralls-url]: https://coveralls.io/github/joakimbeng/node-red-contrib-get-feeds?branch=master
[coveralls-image]: https://coveralls.io/repos/github/joakimbeng/node-red-contrib-get-feeds/badge.svg?branch=master
[codestyle-url]: https://github.com/sindresorhus/xo
[codestyle-image]: https://img.shields.io/badge/code%20style-XO-5ed9c7.svg?style=flat
