import React, { useState } from 'react';
import axios from 'axios';
import { CSVLink } from 'react-csv'; // Import CSV Export Library
import './App.css';

const App = () => {
    const [url, setUrl] = useState('https://');
    const [data, setData] = useState([]);
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
        setScreenshot(''); // Clear previous screenshot when scraping a new website

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
            console.log("Screenshot API Response:", response.data); // Debugging line

            if (response.data.screenshot) {
                // Set the Base64 image with the correct data URI format
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

    const handleUrlChange = (e) => {
        const newUrl = e.target.value.startsWith('https://') ? e.target.value : 'https://';
        setUrl(newUrl);
        setScreenshot(''); // Clear screenshot when entering a new URL
    };

    return (
        <div className="container">
            <h1>Web Scraper Tool</h1>

            <div className="input-group">
                <input
                    type="text"
                    value={url}
                    onChange={handleUrlChange} // Updated to clear screenshot when URL changes
                />
                <button onClick={handleScrape} disabled={loading}>
                    {loading ? 'Scraping...' : 'Scrape Website'}
                </button>
                <button onClick={handleScreenshot} disabled={screenshotLoading}>
                    {screenshotLoading ? 'Capturing...' : 'Capture Screenshot'}
                </button>
            </div>

            {error && <p className="error">{error}</p>}

            {/* Screenshot Display */}
            {screenshot && (
                <div className="screenshot-container">
                    <h2>Screenshot:</h2>
                    <img src={screenshot} alt="Website Screenshot" className="screenshot" />
                </div>
            )}

            {/* Download CSV Button - Only Shows If Data Exists */}
            {data.length > 0 && (
                <CSVLink data={data} filename="scraped_data.csv" className="download-btn">
                    Download CSV
                </CSVLink>
            )}

            {/* Table Display */}
            {data.length > 0 && (
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Text</th>
                                <th>Link</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.text}</td>
                                    <td>
                                        <a href={item.href} target="_blank" rel="noopener noreferrer">
                                            {item.href}
                                        </a>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default App;

