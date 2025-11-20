import { useTheme } from '@emotion/react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useContext, useEffect, useState } from 'react';
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
  const [progress, setProgress] = useState(0);
  const {isDark} = useContext(GlobalContext);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if(progress < rightAnswers) {
      setTimeout(() => {
        setProgress(progress + 1);
      }, 200);
    }
    else {
      setDone(true);
    }
  }, [progress]);

  const percentage = Math.round((parseInt(progress) / parseInt(total)) * 100);

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
          color='info'
        />
      </Box>
      <Box sx={progressContainerSX}>
        <Typography
          variant='h4'
          fontWeight='bold'
        >
          {progress}/{total}
        </Typography>
      </Box>
    </Box>
  );
};

export default Progress;
