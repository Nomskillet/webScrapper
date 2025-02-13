const express = require('express');
const puppeteer = require('puppeteer');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const launchBrowser = async () => {
    return await puppeteer.launch({ headless: "new" });
};

// Scraping Function - Extract More Data
app.post('/api/scrape', async (req, res) => {
    let { url } = req.body;
    if (!url.startsWith('http')) {
        url = `https://${url}`;
    }

    let browser;
    try {
        browser = await launchBrowser();
        const page = await browser.newPage();
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });

        // Scrape the page title
        const title = await page.title();

        // Scrape meta description
        const metaDescription = await page.$eval('meta[name="description"]', el => el.content)
            .catch(() => 'No description available.');

        // Scrape headings (H1, H2, H3)
        const headings = await page.evaluate(() => {
            return Array.from(document.querySelectorAll('h1, h2, h3'))
                .map(h => ({ tag: h.tagName, text: h.innerText.trim() }))
                .filter(h => h.text.length > 0);
        });

        // Scrape images (first 5 images for efficiency)
        const images = await page.evaluate(() => {
            return Array.from(document.querySelectorAll('img'))
                .map(img => img.src)
                .slice(0, 5);
        });

        // Scrape the links
        const links = await page.evaluate(() => {
            return Array.from(document.querySelectorAll('a'))
                .map(link => ({
                    text: link.innerText.trim(),
                    href: link.href
                }))
                .filter(link => link.text && link.href);
        });

        res.json({ title, metaDescription, headings, images, links });
    } catch (error) {
        console.error("Scraping Error:", error.message);
        res.status(500).json({ error: "Failed to scrape the website." });
    } finally {
        if (browser) await browser.close();
    }
});

// Screenshot Function (Unchanged)
app.post('/api/screenshot', async (req, res) => {
    let { url } = req.body;
    if (!url.startsWith('http')) {
        url = `https://${url}`;
    }

    let browser;
    try {
        console.log(`Capturing screenshot for: ${url}`);
        browser = await launchBrowser();
        const page = await browser.newPage();
        await page.setViewport({ width: 1280, height: 1024 });

        await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });

        const screenshot = await page.screenshot({ encoding: 'base64' });

        console.log("Screenshot captured successfully.");
        res.json({ screenshot });
    } catch (error) {
        console.error("Screenshot Error:", error.message);
        res.status(500).json({ error: "Failed to capture screenshot." });
    } finally {
        if (browser) await browser.close();
    }
});

app.listen(5001, () => console.log("Server running on port 5001"));
