#!/usr/bin/env node
const puppeteer = require('puppeteer')
const fs = require('fs')
const program = require('commander')
const screenshotFolder = process.cwd() + '/screenshots'

if (!fs.existsSync(screenshotFolder)){
  fs.mkdirSync(screenshotFolder)
}

function delay(timeout) {
  return new Promise((resolve) => {
    setTimeout(resolve, timeout)
  })
}

program
  .arguments('<input>')
  .option('-w, --width <width>', 'The width of the viewport in pixels (defaults to 1200)')
  .option('-h, --height <height>', 'The height of the viewport in pixels (defaults to 1200)')
  .option('-f, --fullPage <fullPage>', 'Full page (defaults to true)')
  .action(async function(input) {

    let urls = []

    try{
      // read file of URLs
      const urlsFile = fs.readFileSync(input, 'utf8')
      urls = urlsFile.split('\n')
    } catch(e){
      // not a file, probably a URL
      urls.push(input)
    }

    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.setViewport({
        width: parseInt(program.width || 1200),
        height: parseInt(program.height || 1200)
    })
    for (let index=0; index<urls.length; index++){
      let url = urls[index]
      if (url === ''){
        continue
      }
      console.log(url)
      await page.goto(url)
      let filename = url.replace(/^https?:\/\//,'')
      filename = filename.replace(/^www\./,'')
      filename = filename.replace(/\//g,'-')+'.png'
      await page.screenshot({
          fullPage: program.fullPage !== 'false',
          path: screenshotFolder + '/' + filename
      })
      if (index < urls.length-1){
        await delay(1000)
      }
    }
    await browser.close()
    return
  })
  .parse(process.argv);
