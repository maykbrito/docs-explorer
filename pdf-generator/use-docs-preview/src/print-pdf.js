const puppeteer = require('puppeteer')
const { mdContentFromFile } = require('./read-files.js')
const { directories } = require('../config.js')

const testMode = false;

const url = "https://docs-preview-tau.vercel.app/1"

async function printPDF(fileToConvert) {
  const browser = await puppeteer.launch({
    headless: !testMode,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1280,800']
  });

  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'networkidle0' });

  const md = await mdContentFromFile(directories.md + '/' + fileToConvert)

  await page.evaluate((md) => {
    const mdElement = document.querySelector('#md')
    mdElement.setAttribute('reload', md)
  }, md)

  await page.waitForTimeout(100);
  await page.keyboard.press('Escape');

  if (testMode) return;

  const pdf = await page.pdf({
    path: directories.pdf + '/' + fileToConvert.replace('.md', '.pdf'),
    printBackground: true,
    width: '1920px',
    height: '1080px',
  });

  await browser.close();

  return pdf
}

module.exports = { printPDF }
