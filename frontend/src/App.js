import React, { useState } from 'react';
import axios from 'axios';
import { CSVLink } from 'react-csv'; 
import './App.css';

const App = () => {
    const [url, setUrl] = useState('https://');
    const [data, setData] = useState({});
    const [screenshot, setScreenshot] = useState('');
    const [loading, setLoading] = useState(false);
    const [screenshotLoading, setScreenshotLoading] = useState(false);
    const [error, setError] = useState('');

    const handleScrape = async () => {
        if (!url.startsWith('https://')) {
            setError('URL must start with https://');
            return;
        }
        setLoading(true);
        setError('');
        setScreenshot(''); 

        try {
            const response = await axios.post('http://localhost:5001/api/scrape', { url });
            setData(response.data);
        } catch (err) {
            setError('Failed to scrape. Please check the URL.');
        } finally {
            setLoading(false);
        }
    };

    const handleScreenshot = async () => {
        if (!url.startsWith('https://')) {
            setError('URL must start with https://');
            return;
        }
        setScreenshotLoading(true);
        setError('');

        try {
            const response = await axios.post('http://localhost:5001/api/screenshot', { url });
            if (response.data.screenshot) {
                setScreenshot(`data:image/png;base64,${response.data.screenshot}`);
            } else {
                setError('Failed to capture screenshot.');
            }
        } catch (err) {
            setError('Failed to capture screenshot. Please check the URL.');
        } finally {
            setScreenshotLoading(false);
        }
    };

    return (
        <div className="container">
            <h1>Web Scraper Tool</h1>

            <div className="input-group">
                <input type="text" value={url} onChange={e => setUrl(e.target.value)} />
                <button onClick={handleScrape} disabled={loading}>{loading ? 'Scraping...' : 'Scrape Website'}</button>
                <button onClick={handleScreenshot} disabled={screenshotLoading}>{screenshotLoading ? 'Capturing...' : 'Capture Screenshot'}</button>
            </div>

            {error && <p className="error">{error}</p>}

            {data.title && <h2>{data.title}</h2>}
            {data.metaDescription && <p>{data.metaDescription}</p>}

            {screenshot && <img src={screenshot} alt="Screenshot" className="screenshot" />}

            {data.links?.length > 0 && (
                <CSVLink data={data.links} filename="scraped_data.csv" className="download-btn">
                    Download CSV
                </CSVLink>
            )}

            {data.links?.length > 0 && (
                <table>
                    <thead>
                        <tr><th>Text</th><th>Link</th></tr>
                    </thead>
                    <tbody>
                        {data.links.map((item, index) => (
                            <tr key={index}><td>{item.text}</td><td><a href={item.href} target="_blank">{item.href}</a></td></tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default App;
