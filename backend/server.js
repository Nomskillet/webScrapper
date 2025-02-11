const express = require('express');
const puppeteer = require('puppeteer');
const cors = require('cors');

const app = express();  // ✅ This is missing in your code
app.use(cors());
app.use(express.json());

const PORT = 5001;

// Scrape any user-entered URL
app.post('/api/scrape', async (req, res) => {
    const { url } = req.body;

    if (!url) {
        return res.status(400).json({ error: 'No URL provided' });
    }

    try {
        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();
        await page.goto(url, { waitUntil: 'networkidle2' });

        const data = await page.evaluate((baseUrl) => {
            const elements = document.querySelectorAll('a');
            return Array.from(elements)
                .map(el => ({
                    text: el.textContent.trim(),
                    href: el.href.startsWith('http') ? el.href : new URL(el.getAttribute('href'), baseUrl).href
                }))
                .filter(item => item.text.length > 0); // Filter out empty text
        }, url);

        await browser.close();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to scrape website', details: error.toString() });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
