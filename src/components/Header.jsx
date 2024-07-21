import { ArrowBack } from '@mui/icons-material';
import { AppBar, Container, IconButton, Toolbar, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

const Header = ({ title, backButton, extend }) => (
  <AppBar position='sticky'>
    <Toolbar
      sx={{
        paddingX: '0 !important'
      }}
    >
      <Container sx={{
        display: 'flex',
        alignItems: 'center'
      }}>
        {backButton && (
          <Link to={backButton}>
            <IconButton sx={{ mr: 2 }}>
              <ArrowBack />
            </IconButton>
          </Link>
        )}
        <Typography
          variant='h6'
          component='div'
          fontWeight='bold'
          sx={{
            display: 'flex',
            alignItems: 'center',
            flex: 1
          }}
        >
          {title}
        </Typography>
        {extend}
      </Container>
    </Toolbar>
  </AppBar>
);

export default Header;
