import { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import shuffleArray from '../utils/shuffleArray';
import Header from '../components/Header';
import { Button, Container, Dialog, DialogContent } from '@mui/material';
import QuestionsContainer from '../components/QuestionsContainer';
import Question from '../components/Question';
import Progress from '../components/Progress';
import DialogClose from '../components/DialogClose';
import { GlobalContext } from '../GlobalProvider';
import PrintButton from '../components/PrintButton';

const Exam = () => {
  const { subjects } = useContext(GlobalContext);
  const { subjectId } = useParams();
  const subject = subjects.find((subject) => subject.id === subjectId);
  const [questions] = useState(shuffleArray(subject.questions, 10));
  const [rightQuestions, setRightQuestions] = useState([]);
  const [showProgress, setShowProgress] = useState(false);
  const [finished, setFinished] = useState(false);
  const [answers, setAnswers] = useState({});
  const [keyId, setKeyId] = useState(crypto.randomUUID());

  const handleQuestionChange = (id, value) => {
    setAnswers((items) => ({ ...items, [id]: value }));
  };

  const restart = () => {
    setRightQuestions([]);
    setAnswers({});
    setFinished(false);
    setKeyId(crypto.randomUUID());
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

  useEffect(() => {
    document.title = `Simulado - ${subject.subject}`;
  }, [subject]);

  return (
    <>
      <Header
        title={`Simulado - ${subject.subject}`}
        backButton='/'
        extend={
          <>
            <Button
              onClick={() => finished ? restart() : checkAnswers()}
              variant='contained'
              color={finished ? 'success' : 'primary'}
              size='small'
              disabled={Object.keys(answers).length < questions.length}
            >
              {finished ? 'Refazer' : 'Finalizar'}
            </Button>
            <PrintButton />
          </>
        }
      />
      <Container sx={{ py: 4 }}>
        <QuestionsContainer>
          {questions.map((question) => (
            <Question
              question={question}
              key={`${question.id}-${keyId}`}
              onChange={(value) => handleQuestionChange(question.id, value)}
              finished={finished}
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
        <DialogClose onClick={() => setShowProgress(false)} />
      </Dialog>
    </>
  );
};

export default Exam;
