
const puppeteer = require('puppeteer')
const fs = require('fs')
const screenshotFolder = __dirname + '/screenshots'

if (!fs.existsSync(screenshotFolder)){
    fs.mkdirSync(screenshotFolder)
}

function delay(timeout) {
  return new Promise((resolve) => {
    setTimeout(resolve, timeout)
  })
}

const config = require(__dirname + '/config.json')

const urls = config.urls

const screenSize = config.screenSize

console.log('Getting screenshots...')

;(async () => {

  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.setViewport({width: screenSize.width, height: screenSize.height});
  for (let url of urls){
    await page.goto(url)
    console.log(url)
    let filename = url.replace(/^https?:\/\//,'')
    filename = filename.replace(/^www\./,'')
    filename = filename.replace(/\//g,'-')+'.png'
    await page.screenshot({fullPage: config.screenSize.fullPage === true, path:'screenshots/'+filename})
    await delay(1000);
  }
  await browser.close()
  console.log('screenshots done')

})();
