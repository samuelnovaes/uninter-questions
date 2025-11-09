import { Box } from '@mui/material';

const layoutConfig = {
  flex: {
    display: 'flex',
    flexDirection: 'column',
    gap: 2
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
    gap: 2
  }
};

const QuestionsContainer = ({ children, display = 'flex' }) => (
  <Box sx={layoutConfig[display]}>
    {children}
  </Box>
);

export default QuestionsContainer;
