import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

const App = () => {
    const [url, setUrl] = useState('https://');
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleScrape = async () => {
        if (!url.startsWith('https://')) {
            setError('URL must start with https://');
            return;
        }
        setLoading(true);
        setError('');

        try {
            const response = await axios.post('http://localhost:5001/api/scrape', { url });
            setData(response.data);
        } catch (err) {
            setError('Failed to scrape. Please check the URL.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <h1>Web Scraper Tool</h1>
            
            <div className="input-group">
                <input
                    type="text"
                    value={url}
                    onChange={(e) => setUrl(e.target.value.startsWith('https://') ? e.target.value : 'https://')}
                />
                <button onClick={handleScrape} disabled={loading}>
                    {loading ? 'Scraping...' : 'Scrape Website'}
                </button>
            </div>

            {error && <p className="error">{error}</p>}

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
