const puppeteer = require('puppeteer')

const url = "http://localhost:3000/docs/maratonaexplorer/01-html/0101-html"
const output = "html"

async function printPDF() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1280,800']
  });
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'networkidle0' });
  await page.keyboard.press('Escape');
  await page.waitForTimeout(2000);

  // await page.emulateMediaType('screen')
  const pdf = await page.pdf({
    path: './' + output + '.pdf',
    printBackground: true,
    width: '1920px',
    height: '1080px',
  });

  await browser.close();
  return pdf
}

printPDF()
