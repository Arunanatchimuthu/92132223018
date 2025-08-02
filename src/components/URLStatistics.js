import React from 'react';

const URLStatistics = ({ links, isLoading }) => {
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const getShortUrl = (shortCode) => {
    return `http://localhost:5000/api/resolve/${shortCode}`;
  };

  if (isLoading) {
    return (
      <div className="statistics">
        <h6>Statistics</h6>
        <div className="empty-state">
          <div className="loading" style={{ margin: '20px auto' }}></div>
          <p>Loading statistics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="statistics">
      <h6>Statistics</h6>
      
      {links.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📊</div>
          <p>No shortened URLs yet. Create your first one above!</p>
        </div>
      ) : (
        links.map((link) => (
          <div key={link.shortCode} className="link-card">
            <div className="link-info">
              <div className="link-info-item">
                <span className="link-info-label">Short Code</span>
                <span className="link-info-value">{link.shortCode}</span>
              </div>
              
              <div className="link-info-item">
                <span className="link-info-label">Short URL</span>
                <span className="link-info-value">
                  {getShortUrl(link.shortCode)}
                  <button 
                    className="copy-btn"
                    onClick={() => copyToClipboard(getShortUrl(link.shortCode))}
                  >
                    Copy
                  </button>
                </span>
              </div>
              
              <div className="link-info-item">
                <span className="link-info-label">Original URL</span>
                <span className="link-info-value">{link.originalUrl}</span>
              </div>
              
              <div className="link-info-item">
                <span className="link-info-label">Created At</span>
                <span className="link-info-value">{formatDate(link.createdAt)}</span>
              </div>
              
              <div className="link-info-item">
                <span className="link-info-label">Expires At</span>
                <span className="link-info-value">{formatDate(link.expiresAt)}</span>
              </div>
              
              <div className="link-info-item">
                <span className="link-info-label">Total Clicks</span>
                <span className="link-info-value">{link.clicks.length}</span>
              </div>
            </div>
            
            {link.clicks.length > 0 && (
              <div className="clicks-section">
                <div className="clicks-title">Click History</div>
                {link.clicks.map((click, i) => (
                  <div key={i} className="click-item">
                    <strong>{formatDate(click.timestamp)}</strong> - {click.source} ({click.location})
                  </div>
                ))}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default URLStatistics;
