import styled from '@emotion/styled';
import { ArrowBack, DarkMode, LightMode } from '@mui/icons-material';
import { AppBar, Box, Container, IconButton, Toolbar } from '@mui/material';
import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { GlobalContext } from '../GlobalProvider';

const Title = styled.div`
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 20px;
  margin: ${(props) => props.hasMargin ? '0 16px' : '0'};
  @media (width <= 728px) {
    font-size: 16px;
  }
`;

const Header = ({ title, backButton, extend }) => {
  const { isDark, toggleDarkTheme } = useContext(GlobalContext);

  return (
    <AppBar
      position='sticky'
      elevation={0}
      variant='outlined'
      color='inherit'
    >
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
              <IconButton>
                <ArrowBack />
              </IconButton>
            </Link>
          )}
          <Title hasMargin={!!backButton}>{title}</Title>
          <Box
            display='flex'
            alignItems='center'
            gap={2}
          >
            {extend}
            <IconButton onClick={toggleDarkTheme}>
              {isDark && <LightMode />}
              {!isDark && <DarkMode />}
            </IconButton>
          </Box>
        </Container>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
