import { Activity, useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import shuffleArray from '../utils/shuffleArray';
import Header from '../components/Header';
import { Box, Button, ButtonGroup, Container, Dialog, DialogContent, Typography, useMediaQuery } from '@mui/material';
import Question from '../components/Question';
import Progress from '../components/Progress';
import DialogClose from '../components/DialogClose';
import { GlobalContext } from '../GlobalProvider';
import usePagination from '@mui/material/usePagination';
import { Check, ChevronLeft, ChevronRight, Refresh } from '@mui/icons-material';

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

  return (
    <>
      <Header
        title={`Simulado - ${subject.subject}`}
        backButton='/'
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

        <Box
          display='flex'
          alignItems='flex-start'
          justifyContent='center'
          gap={2}
          flexWrap='wrap'
        >
          <ButtonGroup variant='contained' disableElevation>
            <Button
              disabled={index <= 0}
              onClick={() => setIndex((i) => i - 1)}
            >
              <ChevronLeft />
            </Button>
            <Button
              disabled={index >= questions.length - 1}
              onClick={() => setIndex((i) => i + 1)}
            >
              <ChevronRight />
            </Button>
            <Button
              onClick={finished ? reset : checkAnswers}
              disabled={Object.keys(answers).length < questions.length}
            >
              {finished ? <Refresh /> : <Check />}
            </Button>
          </ButtonGroup>

          <ButtonGroup variant='contained' disableElevation>
            {paginationItems.map(({ page, type, selected, ...item }, i) => {
              if (type.endsWith('ellipsis')) {
                return <Button key={i} disabled variant='text'>...</Button>;
              }
              if (type !== 'page') {
                return;
              }
              const question = questions[page - 1];
              return (
                <Box key={i} display='flex' flexDirection='column' alignItems='center'>
                  <Button
                    {...item}
                    disabled={selected}
                  >
                    {page}
                  </Button>
                  <Typography
                    variant='caption'
                    color={
                      finished
                        ? rightQuestions.includes(question.id)
                          ? 'success'
                          : 'error'
                        : 'textPrimary'
                    }
                  >
                    {answers[question.id] || <>&nbsp;</>}
                  </Typography>
                </Box>
              );
            })}
          </ButtonGroup>
        </Box>
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
