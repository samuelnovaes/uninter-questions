import { useTheme } from '@emotion/react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useContext } from 'react';
import { GlobalContext } from '../GlobalProvider';

const progressContainerSX = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  '& .MuiCircularProgress-root': {
    strokeLinecap: 'round'
  }
};

const Progress = ({ rightAnswers, total }) => {
  const theme = useTheme();
  const percentage = Math.round((parseInt(rightAnswers) / parseInt(total)) * 100);
  const {isDark} = useContext(GlobalContext);

  return (
    <Box sx={{
      position: 'relative',
      height: 200,
      width: 200
    }}>
      <Box sx={progressContainerSX}>
        <CircularProgress
          variant='determinate'
          size={200}
          value={100}
          sx={{ color: theme.palette.grey[isDark ? 900 : 100] }}
        />
      </Box>
      <Box sx={progressContainerSX}>
        <CircularProgress
          variant='determinate'
          value={percentage}
          size={200}
          color={percentage >= 70 ? 'success' : 'error'}
        />
      </Box>
      <Box sx={progressContainerSX}>
        <Typography
          variant='h4'
          fontWeight='bold'
        >
          {rightAnswers}/{total}
        </Typography>
      </Box>
    </Box>
  );
};

export default Progress;
