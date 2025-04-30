import React from 'react';
import { Box, Typography, Grid, Card, CardContent, CardActions, Button } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const Home: React.FC = () => {
  const features = [
    {
      title: 'Spell Check',
      description: 'Check and correct the spelling of your texts.',
      path: '/spellcheck',
    },
    {
      title: 'PDF to Image',
      description: 'Convert your PDF files to images.',
      path: '/pdf-to-image',
    },
    {
      title: 'Separator',
      description: 'Separate and organize your document content.',
      path: '/separator',
    },
    {
      title: 'Crop Image',
      description: 'Crop and adjust your images according to your needs.',
      path: '/crop',
    },
  ];

  return (
    <Box sx={{ flexGrow: 1, mt: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom align="center">
        Welcome to Die Botschaft Transcript AI
      </Typography>
      <Typography variant="h5" component="h2" gutterBottom align="center" color="text.secondary">
        Advanced tools for document processing
      </Typography>
      
      <Grid container spacing={4} sx={{ mt: 4 }}>
        {features.map((feature) => (
          <Grid item xs={12} sm={6} md={3} key={feature.title}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h5" component="h2">
                  {feature.title}
                </Typography>
                <Typography>
                  {feature.description}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  component={RouterLink}
                  to={feature.path}
                  variant="contained"
                  color="primary"
                  fullWidth
                >
                  Use tool
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Home; 