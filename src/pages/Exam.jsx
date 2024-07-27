import { useContext, useState } from 'react';
import { useParams } from 'react-router-dom';
import { RepositoryContext } from '../providers/RepositoryProvider';
import shuffleArray from '../utils/shuffleArray';
import Header from '../components/Header';
import { Button, Container, Dialog, DialogContent } from '@mui/material';
import QuestionsContainer from '../components/QuestionsContainer';
import Question from '../components/Question';
import Progress from '../components/Progress';

const Exam = () => {
  const subjects = useContext(RepositoryContext);
  const { subjectId } = useParams();
  const subject = subjects.find((subject) => subject.id === subjectId);
  const [questions] = useState(shuffleArray(subject.questions, 10));
  const [rightQuestions, setRightQuestions] = useState([]);
  const [showProgress, setShowProgress] = useState(false);
  const [finished, setFinished] = useState(false);
  const [answers, setAnswers] = useState({});

  const handleQuestionChange = (id, value) => {
    setAnswers((items) => ({ ...items, [id]: value }));
  };

  const restart = () => {
    setRightQuestions([]);
    setAnswers({});
    setFinished(false);
  };

  const checkAnswers = () => {
    setRightQuestions(
      questions
        .filter((question) => answers[question.id] === question.options.find((option) => option.rightAnswer).name)
        .map((question) => question.id)
    );
    setShowProgress(true);
    setFinished(true);
  };

  return (
    <>
      <Header
        title={`Simulado - ${subject.subject}`}
        backButton='/'
        extend={
          <Button
            onClick={() => finished ? restart() : checkAnswers()}
            variant='contained'
            color={finished ? 'success' : 'primary'}
            size='small'
            disabled={Object.keys(answers).length < questions.length}
          >
            {finished ? 'Refazer' : 'Finalizar'}
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
      <Dialog
        open={showProgress}
        onClose={() => setShowProgress(false)}
      >
        <DialogContent>
          <Progress rightAnswers={rightQuestions.length} total={questions.length} />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Exam;
