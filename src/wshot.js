#!/usr/bin/env node
'use strict'

const puppeteer = require('puppeteer')
const fs = require('fs')
const program = require('commander')
const screenshotFolder = process.cwd() + '/screenshots'

if (!fs.existsSync(screenshotFolder)) {
  fs.mkdirSync(screenshotFolder)
}

function delay (timeout) {
  return new Promise((resolve) => {
    setTimeout(resolve, timeout)
  })
}

const description = `Take screenshots of web pages.

  Examples:

  wshot https://www.gov.uk
  wshot myURLs.txt

  If you supply a text file, it should be a list of URLs, each on a new line.
  wshot will take a screenshot of each URL.
`

program
  .arguments('<input>')
  .description(description)
  .option('-w, --width <width>', 'The width of the viewport in pixels (defaults to 1200)')
  .option('-h, --height <height>', 'The height of the viewport in pixels (defaults to the full height of the page)')
  .action(function (input) {
     program.input = input
  })
  .parse(process.argv)

if (program.input === undefined){
  console.error("Missing input, try wshot --help")
  process.exit()
}

const input = program.input

const fullPage = (program.height === undefined)

let urls = []

try {
  // read file of URLs
  const urlsFile = fs.readFileSync(input, 'utf8')
  urls = urlsFile.split('\n')
} catch (e) {
  // not a file, probably a URL
  urls.push(input)
}

(async () => {

  const timeout = 10 * 1000
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  let delayBetweenCalls = 0;
  await page.setViewport({
    width: parseInt(program.width || 1200),
    height: parseInt(program.height || 1200)
  })
  for (let url of urls.filter(line => line.trim())) {
    await delay(delayBetweenCalls)
    delayBetweenCalls = 1000
    console.log(url)
    try {
      await page.goto(url, {
        timeout: timeout
      })
    } catch (error){
      if (error.message.indexOf("Navigation Timeout Exceeded") === 0){
        console.error(`Error: Server did not respond within ${timeout / 1000} seconds`)
        continue
      } else if (error.message.indexOf("Protocol error (Page.navigate): Cannot navigate to invalid URL") === 0){
        console.error(`Error: This doesn't seem to be a correct URL`)
        continue
      } else {
        console.error(error)
        continue
      }
    }
    let filename = url.replace(/^https?:\/\//, '')
    filename = filename.replace(/^www\./, '')
    filename = filename.replace(/\//g, '-') + '.png'
    await page.screenshot({
      fullPage: fullPage,
      path: screenshotFolder + '/' + filename
    })
  }
  await browser.close()

})()
