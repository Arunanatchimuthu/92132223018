import { createContext, useContext } from 'react';

const LoggerContext = createContext();

export const LoggerProvider = ({ children }) => {
  const logID = "4f0b9a30-d676-472c-9cf5-1a67fea14e42";
  
  const log = (message) => {
    const timestamp = new Date().toISOString();
    const logEntry = {
      logID: logID,
      timestamp: timestamp,
      message: message,
      level: 'INFO',
      source: 'URL_SHORTENER_FRONTEND'
    };
    
    // Log to console (this is the logging middleware implementation)
    console.log(`[LOGGER ${timestamp}] [${logID}] ${message}`);
    
    // You can also send logs to a backend endpoint if needed
    // sendLogToBackend(logEntry);
  };

  const logError = (message, error) => {
    const timestamp = new Date().toISOString();
    const logEntry = {
      logID: logID,
      timestamp: timestamp,
      message: message,
      error: error?.message || error,
      level: 'ERROR',
      source: 'URL_SHORTENER_FRONTEND'
    };
    
    console.error(`[LOGGER ${timestamp}] [${logID}] ERROR: ${message}`, error);
  };

  const logWarning = (message) => {
    const timestamp = new Date().toISOString();
    const logEntry = {
      logID: logID,
      timestamp: timestamp,
      message: message,
      level: 'WARNING',
      source: 'URL_SHORTENER_FRONTEND'
    };
    
    console.warn(`[LOGGER ${timestamp}] [${logID}] WARNING: ${message}`);
  };

  return (
    <LoggerContext.Provider value={{ log, logError, logWarning, logID }}>
      {children}
    </LoggerContext.Provider>
  );
};

export const useLogger = () => useContext(LoggerContext);
