import styled from '@emotion/styled';
import { ArrowBack } from '@mui/icons-material';
import { AppBar, Container, IconButton, Toolbar } from '@mui/material';
import { Link } from 'react-router-dom';

const Title = styled.div`
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: bold;
  font-size: 20px;
  margin: ${(props) => props.hasMargin ? '0 16px' : '0'};
  @media (width <= 728px) {
    font-size: 16px;
  }
`;

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
            <IconButton>
              <ArrowBack />
            </IconButton>
          </Link>
        )}
        <Title hasMargin={!!backButton}>{title}</Title>
        {extend}
      </Container>
    </Toolbar>
  </AppBar>
);

export default Header;
