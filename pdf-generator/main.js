const puppeteer = require('puppeteer')
 
async function printPDF() {
  const browser = await puppeteer.launch({ 
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1440,900']
  });
  const page = await browser.newPage();
  await page.goto('http://localhost:3000/#/0301-dom/1', {waitUntil: 'networkidle0'});
  await page.keyboard.press('Escape');
  await page.waitForTimeout(2000);
  
  // await page.emulateMediaType('screen')
  const pdf = await page.pdf({ 
    path: './output.pdf', 
    printBackground: true,
    width: '1920px',
    height: '1080px',
  });
 
  await browser.close();
  return pdf
}

printPDF()