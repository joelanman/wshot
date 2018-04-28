#!/usr/bin/env node

'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const puppeteer = require('puppeteer');
const fs = require('fs');
const program = require('commander');
const screenshotFolder = process.cwd() + '/screenshots';

if (!fs.existsSync(screenshotFolder)) {
  fs.mkdirSync(screenshotFolder);
}

function delay(timeout) {
  return new Promise(resolve => {
    setTimeout(resolve, timeout);
  });
}

const description = `Take screenshots of web pages.

  Examples:

  wshot https://www.gov.uk
  wshot myURLs.txt

  If you supply a text file, it should be a list of URLs, each on a new line.
  wshot will take a screenshot of each URL.
`;

program.arguments('<input>').description(description).option('-w, --width <width>', 'The width of the viewport in pixels (defaults to 1200)').option('-h, --height <height>', 'The height of the viewport in pixels (defaults to the full height of the page)').action(function (input) {
  program.input = input;
}).parse(process.argv);

if (program.input === undefined) {
  console.error("Missing input, try wshot --help");
  process.exit();
}

const input = program.input;

const fullPage = program.height === undefined;

let urls = [];

try {
  // read file of URLs
  const urlsFile = fs.readFileSync(input, 'utf8');
  urls = urlsFile.split('\n');
} catch (e) {
  // not a file, probably a URL
  urls.push(input);
}

_asyncToGenerator(function* () {

  const browser = yield puppeteer.launch();
  const page = yield browser.newPage();
  yield page.setViewport({
    width: parseInt(program.width || 1200),
    height: parseInt(program.height || 1200)
  });
  for (let index = 0; index < urls.length; index++) {
    let url = urls[index];
    if (url === '') {
      continue;
    }
    console.log(url);
    yield page.goto(url);
    let filename = url.replace(/^https?:\/\//, '');
    filename = filename.replace(/^www\./, '');
    filename = filename.replace(/\//g, '-') + '.png';
    yield page.screenshot({
      fullPage: fullPage,
      path: screenshotFolder + '/' + filename
    });
    if (index < urls.length - 1) {
      yield delay(1000);
    }
  }
  yield browser.close();
})();