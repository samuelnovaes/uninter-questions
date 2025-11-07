import { Box } from '@mui/material';

const QuestionsContainer = ({ children }) => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      gap: 2
    }}
  >
    {children}
  </Box>
);

export default QuestionsContainer;

