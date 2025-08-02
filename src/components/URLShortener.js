import React, { useState } from 'react';
import { useLogger } from '../context/LoggerContext';

const URLShortener = ({ onAdd }) => {
  const [url, setUrl] = useState('');
  const [expiry, setExpiry] = useState('');
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const { log } = useLogger();

  const handleShorten = async () => {
    if (!url) {
      setMessage('URL is required');
      return;
    }

    setIsLoading(true);
    setMessage('');

    const payload = {
      originalUrl: url,
      expiry: expiry ? parseInt(expiry) : 30,
      customCode: code || undefined
    };
    log(`Sending request to shorten URL: ${url}`);

    try {
      const res = await fetch('http://localhost:5000/api/shorten', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok) {
        onAdd(data);
        log(`Shortened: ${data.shortCode}`);
        setMessage('URL shortened successfully!');
        setUrl('');
        setExpiry('');
        setCode('');
      } else {
        setMessage(data.error);
      }
    } catch (error) {
      setMessage('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="url-shortener">
      <h6>Shorten URL</h6>
      
      {message && (
        <div className={`message ${message.includes('successfully') ? 'success' : 'error'}`}>
          {message}
        </div>
      )}
      
      <div className="form-field">
        <label>Long URL</label>
        <input
          type="url"
          placeholder="https://example.com/very-long-url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
      </div>
      
      <div className="form-field">
        <label>Expiry (minutes)</label>
        <input
          type="number"
          placeholder="30"
          value={expiry}
          onChange={(e) => setExpiry(e.target.value)}
        />
      </div>
      
      <div className="form-field">
        <label>Custom Code (optional)</label>
        <input
          type="text"
          placeholder="my-custom-code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
      </div>
      
      <button 
        className="shorten-btn" 
        onClick={handleShorten}
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <span className="loading"></span>
            Shortening...
          </>
        ) : (
          'Shorten URL'
        )}
      </button>
    </div>
  );
};

export default URLShortener;
