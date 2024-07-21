import { createBrowserRouter } from 'react-router-dom';
import SubjectsPage from './pages/Subjects';
import Answers from './pages/Answers';
import Exam from './pages/Exam';
import Feedback from './pages/Feedback';

const router = createBrowserRouter([
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
  },
  {
    path: '/feedback/:subjectId/:rightAnswers/:total',
    element: <Feedback />
  }
], { basename: '/uninter-questions' });

export default router;
