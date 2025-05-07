import React from 'react';
import { AppBar, Toolbar, Typography, Button, Container, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import { styled } from '@mui/material/styles';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  marginBottom: theme.spacing(4),
}));

const StyledLink = styled(Link)(({ theme }) => ({
  color: 'white',
  textDecoration: 'none',
  marginLeft: theme.spacing(3),
}));

const TitleLink = styled(Link)(({ theme }) => ({
  color: 'white',
  textDecoration: 'none',
  flexGrow: 1,
}));

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <StyledAppBar position="static">
        <Toolbar>
          <Typography variant="h6" component={Link} to="/" sx={{ color: 'white', textDecoration: 'none', flexGrow: 1 }}>
            Die Botschaft Transcript AI
          </Typography>

          <StyledLink to="/">
            <Button color="inherit">Home</Button>
          </StyledLink>
          <StyledLink to="/spellcheck">
            <Button color="inherit">Spell Check</Button>
          </StyledLink>
          <StyledLink to="/pdf-to-image">
            <Button color="inherit">PDF to Image</Button>
          </StyledLink>
          <StyledLink to="/separator">
            <Button color="inherit">Separator</Button>
          </StyledLink>
          <StyledLink to="/crop">
            <Button color="inherit">Crop Image</Button>
          </StyledLink>
        </Toolbar>
      </StyledAppBar>
      <Container maxWidth="lg">
        {children}
      </Container>
    </Box>
  );
};

export default Layout;

