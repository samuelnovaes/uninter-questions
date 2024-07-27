import { createHashRouter } from 'react-router-dom';
import SubjectsPage from './pages/Subjects';
import Answers from './pages/Answers';
import Exam from './pages/Exam';

const router = createHashRouter([
  {
    path: '/',
    element: <SubjectsPage />
  },
  {
    path: '/answers/:subjectId',
    element: <Answers />
  },
  {
    path: '/exam/:subjectId',
    element: <Exam />
  }
]);

export default router;
