const puppeteer = require('puppeteer');
const axios = require('axios');
const express = require('express');
const app = express();
 
app.get('/scrape', async (req, res) => {
    const browser = await puppeteer.launch({headless: false}); // headless mode set to false so that we can see the browser window for debugging. 
    const page = await browser.newPage();

    await page.goto('https://www.memedroid.com/memes/latest');

    let dataArray = [];

    const result = await page.evaluate(() => {
        let dataArray = []; // Create an empty array that will store our data

        // Get the images and titles from the page: 
        let images = document.querySelectorAll('.meme-image img'); 
        let titles = document.querySelectorAll('.meme-title a');

        for (var i=0; i < images.length; i++) { // Loop through each image and title on the page and push to our array: 

            let imageUrl = images[i].getAttribute('src'); // Get the image URL from each image element 

            let titleText = titles[i].innerText; // Get the text from each title element 

            dataArray.push({imageUrl, titleText}); // Push an object containing the image URL and title text into our array 
        }

        return dataArray; // Return our array which should now contain objects with the image URLs and associated titles 
    });

    for (let i=0; i < result.length; i++) { // Loop through each item in our results array: 

        let imgUrl = result[i].imageUrl; // Get the image URL from each item in our results array  

        let responseImgData = await axios({url: imgUrl, responseType:'arraybuffer'}); // Make a request for each image using Axios  

        let base64ImgData = Buffer.from(responseImgData.data, 'binary').toString('base64'); // Convert the binary data to base64 format  

        result[i].imgBase64Data=base64ImgData;// Add a new property to each item in our results array containing the base64 encoded image data  
    }    

    res.json(result);// Send back our JSON response containing all of our meme information  
});
