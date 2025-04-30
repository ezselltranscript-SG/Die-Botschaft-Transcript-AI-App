import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  CircularProgress,
  Alert,
} from '@mui/material';
import { CloudUpload as CloudUploadIcon } from '@mui/icons-material';
import api, { endpoints } from '../config/api';

const PDFToImage: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setDownloadUrl(null); // Clear previous download URL
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    setError(null);
    setDownloadUrl(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      console.log('Sending request to:', endpoints.pdfToImage.convert);
      const response = await api.post(endpoints.pdfToImage.convert, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        responseType: 'blob', // Indicate we expect a blob as response
      });
      console.log('Response received:', response.data);

      // Create URL for the blob
      const blob = new Blob([response.data], { type: 'application/zip' });
      const url = window.URL.createObjectURL(blob);
      setDownloadUrl(url);
    } catch (err) {
      console.error('Request error:', err);
      setError('Error converting PDF. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        PDF to Image Conversion
      </Typography>
      <Typography variant="body1" paragraph>
        Upload a PDF file and our system will convert it into high-quality images.
      </Typography>

      <Paper sx={{ p: 3, mt: 2 }}>
        <form onSubmit={handleSubmit}>
          <input
            accept=".pdf"
            style={{ display: 'none' }}
            id="pdf-upload"
            type="file"
            onChange={handleFileChange}
          />
          <label htmlFor="pdf-upload">
            <Button
              variant="contained"
              component="span"
              startIcon={<CloudUploadIcon />}
              disabled={loading}
            >
              Select PDF
            </Button>
          </label>
          {file && (
            <Typography variant="body2" sx={{ mt: 1 }}>
              Selected file: {file.name}
            </Typography>
          )}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading || !file}
            sx={{ mt: 2, ml: 2 }}
          >
            {loading ? <CircularProgress size={24} /> : 'Convert to Images'}
          </Button>
        </form>

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}

        {downloadUrl && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Generated ZIP file:
            </Typography>
            <Button
              variant="contained"
              color="primary"
              href={downloadUrl}
              download="converted_images.zip"
            >
              Download Images
            </Button>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default PDFToImage; 