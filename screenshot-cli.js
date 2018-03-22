#!/usr/bin/env node
const puppeteer = require('puppeteer')
const fs = require('fs')
const program = require('commander')
const screenshotFolder = process.cwd() + '/screenshots'

if (!fs.existsSync(screenshotFolder)){
    fs.mkdirSync(screenshotFolder)
}

program
  .arguments('<url>')
  .option('-w, --width <width>', 'The width of the viewport in pixels (defaults to 1200)')
  .option('-h, --height <height>', 'The height of the viewport in pixels (defaults to 1200)')
  .option('-f, --fullPage <fullPage>', 'Full page (defaults to true)')
  .action(async function(url) {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.setViewport({
        width: parseInt(program.width || 1200),
        height: parseInt(program.height || 1200)
    });
    await page.goto(url)
    let filename = url.replace(/^https?:\/\//,'')
    filename = filename.replace(/^www\./,'')
    filename = filename.replace(/\//g,'-')+'.png'
    await page.screenshot({
        fullPage: program.fullPage !== 'false',
        path: screenshotFolder + '/' + filename
    })
    await browser.close()
    return
  })
  .parse(process.argv);
