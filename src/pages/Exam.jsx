import { useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { RepositoryContext } from '../providers/RepositoryProvider';
import shuffleArray from '../utils/shuffleArray';
import Header from '../components/Header';
import { Button, Container } from '@mui/material';
import QuestionsContainer from '../components/QuestionsContainer';
import Question from '../components/Question';

const Exam = () => {
  const subjects = useContext(RepositoryContext);
  const { subjectId } = useParams();
  const subject = subjects.find((subject) => subject.id === subjectId);
  const questions = shuffleArray(subject.questions, 10);
  const navigate = useNavigate();
  const answers = {};

  const handleQuestionChange = (id, value) => {
    answers[id] = value;
  };

  const checkAnswers = () => {
    if(questions.some((question) => !answers[question.id])) {
      alert('Preencha todas as questões!');
      return;
    }
    const rightQuestions = questions.filter(
      (question) => answers[question.id] === question.options.find((option) => option.rightAnswer).name
    );
    navigate(`/feedback/${subject.id}/${rightQuestions.length}/${questions.length}`);
  };

  return (
    <>
      <Header
        title={`Simulado - ${subject.subject}`}
        backButton='/'
        extend={
          <Button
            onClick={checkAnswers}
            variant='contained'
            color='success'
            size='small'
          >
            Enviar
          </Button>
        }
      />
      <Container sx={{ py: 4 }}>
        <QuestionsContainer>
          {questions.map((question) => (
            <Question
              question={question}
              key={question.id}
              onChange={(value) => handleQuestionChange(question.id, value)}
            />
          ))}
        </QuestionsContainer>
      </Container>
    </>
  );
};

export default Exam;
