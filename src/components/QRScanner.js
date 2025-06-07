// src/components/QRScanner.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  Typography,
  Button,
  Paper,
  Container
} from '@mui/material';
import QrScanner from 'qr-scanner';

function QRScanner() {
  const [scanResult, setScanResult] = useState('');
  const [error, setError] = useState('');
  const [scanning, setScanning] = useState(false);
  const videoRef = React.useRef(null);
  const qrScannerRef = React.useRef(null);
  const navigate = useNavigate();

  const handleScan = async (result) => {
    setScanning(false);
    setScanResult(result);
    
    try {
      const res = await axios.post('/api/events/scan', { qrCodeData: result }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      
      setError('');
      // Show success message
      setTimeout(() => {
        navigate(`https://qrauth-backend-1.onrender.com/event/${res.data.event._id}`);
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to record attendance');
    }
  };

  const startScanner = () => {
    setScanning(true);
    setScanResult('');
    setError('');
    
    qrScannerRef.current = new QrScanner(
      videoRef.current,
      result => handleScan(result.data),
      {
        preferredCamera: 'environment',
        highlightScanRegion: true,
        highlightCodeOutline: true,
      }
    );
    
    qrScannerRef.current.start();
  };

  const stopScanner = () => {
    if (qrScannerRef.current) {
      qrScannerRef.current.stop();
      qrScannerRef.current = null;
    }
    setScanning(false);
  };

  useEffect(() => {
    return () => {
      if (qrScannerRef.current) {
        qrScannerRef.current.stop();
        qrScannerRef.current = null;
      }
    };
  }, []);

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          QR Code Scanner
        </Typography>
        
        {error && (
          <Typography color="error" align="center" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}
        
        {scanResult && !error && (
          <Typography color="success" align="center" sx={{ mb: 2 }}>
            Attendance recorded successfully!
          </Typography>
        )}
        
        <Box sx={{ 
          width: '100%', 
          height: 300, 
          backgroundColor: '#f5f5f5',
          mb: 2,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          overflow: 'hidden'
        }}>
          {scanning ? (
            <video
              ref={videoRef}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            <Typography color="textSecondary">
              Scanner inactive
            </Typography>
          )}
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
          {!scanning ? (
            <Button
              variant="contained"
              onClick={startScanner}
            >
              Start Scanner
            </Button>
          ) : (
            <Button
              variant="outlined"
              color="secondary"
              onClick={stopScanner}
            >
              Stop Scanner
            </Button>
          )}
          
          <Button
            variant="outlined"
            onClick={() => navigate('/')}
          >
            Back to Events
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

export default QRScanner;