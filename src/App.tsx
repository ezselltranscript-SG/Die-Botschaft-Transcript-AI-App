import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Layout from './components/Layout';
import Home from './pages/Home';
import SpellCheck from './pages/SpellCheck';
import PDFToImage from './pages/PDFToImage';
import Separator from './pages/Separator';
import CropImage from './pages/CropImage';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/spellcheck" element={<SpellCheck />} />
            <Route path="/pdf-to-image" element={<PDFToImage />} />
            <Route path="/separator" element={<Separator />} />
            <Route path="/crop" element={<CropImage />} />
          </Routes>
        </Layout>
      </Router>
    </ThemeProvider>
  );
}

export default App;
