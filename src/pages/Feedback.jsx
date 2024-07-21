import { useContext } from 'react';
import Header from '../components/Header';
import { useParams } from 'react-router-dom';
import { RepositoryContext } from '../providers/RepositoryProvider';
import { Box, CircularProgress, Typography, useTheme } from '@mui/material';

const progressContainerSX = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  '& .MuiCircularProgress-root': {
    strokeLinecap: 'round'
  }
};

const Feedback = () => {
  const subjects = useContext(RepositoryContext);
  const { subjectId, rightAnswers, total } = useParams();
  const subject = subjects.find((subject) => subject.id === subjectId);
  const percentage = Math.round((parseInt(rightAnswers) / parseInt(total)) * 100);
  const theme = useTheme();

  return (
    <Box
      display='flex'
      flexDirection='column'
      height='100vh'
    >
      <Header
        title={`Resultado - ${subject.subject}`}
        backButton='/'
      />
      <Box flex={1} position='relative'>
        <Box sx={progressContainerSX}>
          <CircularProgress
            variant='determinate'
            size={200}
            value={100}
            sx={{color: theme.palette.grey[800]}}
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
    </Box>
  );
};

export default Feedback;
