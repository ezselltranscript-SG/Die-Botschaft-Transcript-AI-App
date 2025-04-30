import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import api, { endpoints } from '../config/api';

interface Correction {
  original: string;
  corrected: string;
  similarity: number;
  source: string;
}

interface SpellCheckResponse {
  corrected_text: string;
  corrections: Correction[];
}

const SpellCheck: React.FC = () => {
  const [text, setText] = useState('');
  const [result, setResult] = useState<SpellCheckResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      console.log('Sending request to:', endpoints.spellcheck.check);
      console.log('With data:', { text });
      const response = await api.post(endpoints.spellcheck.check, {
        text,
      });
      console.log('Response received:', response.data);
      setResult(response.data);
    } catch (err) {
      console.error('Request error:', err);
      setError('Error checking spelling. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Spell Check
      </Typography>
      <Typography variant="body1" paragraph>
        Enter the text you want to check and our system will analyze it to detect and correct spelling errors.
      </Typography>

      <Paper sx={{ p: 3, mt: 2 }}>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            multiline
            rows={6}
            label="Text to check"
            value={text}
            onChange={(e) => setText(e.target.value)}
            variant="outlined"
            margin="normal"
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading || !text.trim()}
            sx={{ mt: 2 }}
          >
            {loading ? <CircularProgress size={24} /> : 'Check Spelling'}
          </Button>
        </form>

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}

        {result && result.corrected_text && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Corrected Text:
            </Typography>
            <Paper sx={{ p: 2, bgcolor: 'grey.100', mb: 2 }}>
              <Typography>{result.corrected_text}</Typography>
            </Paper>

            {result.corrections && result.corrections.length > 0 && (
              <>
                <Typography variant="h6" gutterBottom>
                  Corrections Made:
                </Typography>
                <List>
                  {result.corrections.map((correction, index) => (
                    <React.Fragment key={index}>
                      <ListItem>
                        <ListItemText
                          primary={`${correction.original} → ${correction.corrected}`}
                          secondary={`Similarity: ${correction.similarity}% | Source: ${correction.source}`}
                        />
                      </ListItem>
                      {index < result.corrections.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              </>
            )}
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default SpellCheck; 