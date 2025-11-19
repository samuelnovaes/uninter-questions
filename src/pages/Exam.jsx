import { Activity, useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import shuffleArray from '../utils/shuffleArray';
import Header from '../components/Header';
import { Button, ButtonGroup, Container, Dialog, DialogContent, IconButton, useMediaQuery } from '@mui/material';
import Question from '../components/Question';
import Progress from '../components/Progress';
import DialogClose from '../components/DialogClose';
import { GlobalContext } from '../GlobalProvider';
import usePagination from '@mui/material/usePagination';
import { ChevronLeft, ChevronRight, Refresh } from '@mui/icons-material';

const Exam = () => {
  const { subjects } = useContext(GlobalContext);
  const { subjectId } = useParams();
  const subject = subjects.find((subject) => subject.id === subjectId);

  const [questions, setQuestions] = useState(shuffleArray(subject.questions, 10));
  const [rightQuestions, setRightQuestions] = useState([]);
  const [showProgress, setShowProgress] = useState(false);
  const [finished, setFinished] = useState(false);
  const [answers, setAnswers] = useState({});
  const [keyId, setKeyId] = useState(crypto.randomUUID());
  const [index, setIndex] = useState(0);

  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('md'));

  const { items: paginationItems } = usePagination({
    page: index + 1,
    count: questions.length,
    onChange: (_, value) => setIndex(value - 1),
    siblingCount: isMobile ? 1 : 10
  });

  const handleQuestionChange = (id, value) => {
    setAnswers((items) => ({ ...items, [id]: value }));
  };

  const restart = () => {
    setRightQuestions([]);
    setAnswers({});
    setFinished(false);
    setKeyId(crypto.randomUUID());
    setIndex(0);
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

  const reset = () => {
    setRightQuestions([]);
    setAnswers({});
    setFinished(false);
    setKeyId(crypto.randomUUID());
    setIndex(0);
    setQuestions(shuffleArray(subject.questions, 10));
  };

  useEffect(() => {
    document.title = `Simulado - ${subject.subject}`;
  }, [subject]);

  const getColor = (question, selected, type) => {
    if (type !== 'page') {
      return 'inherit';
    }
    if (finished) {
      if (rightQuestions.includes(question.id)) {
        return 'success';
      }
      return 'error';
    }
    if (answers[question.id]) {
      return 'info';
    }
    if (selected) {
      return 'white';
    }
    return 'inherit';
  };

  return (
    <>
      <Header
        title={`Simulado - ${subject.subject}`}
        backButton='/'
        extend={
          <IconButton onClick={reset}>
            <Refresh />
          </IconButton>
        }
      />
      <Container sx={{
        py: 4,
        gap: 4,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        {questions.map((question, i) => (
          <Activity key={`${question.id}-${keyId}`} mode={index === i ? 'visible' : 'hidden'}>
            <Question
              question={question}
              onChange={(value) => handleQuestionChange(question.id, value)}
              finished={finished}
            />
          </Activity>
        ))}
        <ButtonGroup>
          {paginationItems.map(({ page, type, selected, ...item }, i) => {
            if (type.endsWith('ellipsis')) {
              return <Button key={i} disabled variant='text'>...</Button>;
            }
            const question = type === 'page' && questions[page - 1];
            return (
              <Button
                key={i}
                {...item}
                variant={selected ? 'contained' : 'text'}
                color={getColor(question, selected, type)}
                disableElevation
              >
                {type === 'page' && page}
                {type === 'previous' && <ChevronLeft />}
                {type === 'next' && <ChevronRight />}
              </Button>
            );
          })}
        </ButtonGroup>
        <Button
          onClick={() => finished ? restart() : checkAnswers()}
          variant='contained'
          disabled={Object.keys(answers).length < questions.length}
          disableElevation
        >
          {finished ? 'Refazer' : 'Finalizar'}
        </Button>
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
