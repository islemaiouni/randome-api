const PORT = 5000;
const puppeteer = require('puppeteer');
const express = require('express');
const app = express();

async function getAllMemes() {
  const URL = 'https://www.memedroid.com/memes/tag/programming';

  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto(URL);

  const allImages = await page.$$eval('div.item-aux-container img[src]', imgs =>
    imgs.map(img => {
      if (
        img.getAttribute('src').startsWith('http') &&
        img.getAttribute('src').endsWith('jpeg')
      )
        return img.getAttribute('src');
    })
  );

  const imgs = allImages.filter(img => img !== null);
  await browser.close();
  return imgs;
}

app.get('/',  (req, res) => {
  res.send(welcome);
})

app.get('/data', async (req, res) => {
  const memes = await getAllMemes();
  const randomNumber = Math.round(Math.random() * memes.length);
  res.send(memes[randomNumber]);
  console.log(memes[randomNumber]);
});


app.listen(PORT, () => console.log(`server running on PORT ${PORT}`))
