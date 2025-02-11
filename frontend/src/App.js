import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:5001/api/scraped-data'); // Updated port
                setData(response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return <h1>Loading...</h1>;

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial' }}>
            <h1>Scraped ESPN Data</h1>
            <table border="1" cellPadding="10" style={{ width: '100%', textAlign: 'left' }}>
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
    );
};

export default App;

