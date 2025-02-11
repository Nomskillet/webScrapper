const puppeteer = require('puppeteer');
const fs = require('fs');

const url = 'https://espn.com';

async function scrapeESPN() {
    try {
        const browser = await puppeteer.launch({ headless: false });
        const page = await browser.newPage();

        // Set user agent to avoid bot detection
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
        await page.setExtraHTTPHeaders({ 'Accept-Language': 'en-US,en;q=0.9' });

        console.log("Navigating to the URL...");
        await page.goto(url, { waitUntil: 'networkidle2' });
        console.log("Page loaded successfully!");

        // Save the page content for debugging
        const content = await page.content();
        fs.writeFileSync('pageContent.html', content);
        console.log("Page content saved to pageContent.html");

        // Debug: Log available selectors
        const data = await page.evaluate(() => {
            const allLinks = Array.from(document.querySelectorAll('a')); // Get all anchor tags
            return allLinks.map(link => ({
                text: link.textContent.trim(),
                href: link.href
            }));
        });

        console.log("Extracted Links: ", data); // Log all links to find the correct ones
        fs.writeFileSync('espnData.json', JSON.stringify(data, null, 2));
        console.log('Scraping complete! Data saved to espnData.json');

        await browser.close();
    } catch (error) {
        console.error('Error scraping ESPN:', error);
    }
}

scrapeESPN();

