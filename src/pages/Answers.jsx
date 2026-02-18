import { useParams } from 'react-router-dom';
import Header from '../components/Header';
import { useContext, useEffect, useState } from 'react';
import textMatch from '../utils/textMatch';
import { Container } from '@mui/material';
import Question from '../components/Question';
import QuestionsContainer from '../components/QuestionsContainer';
import SearchField from '../components/SearchField';
import { GlobalContext } from '../GlobalProvider';
import PrintButton from '../components/PrintButton';

const Answers = () => {
  const { subjects } = useContext(GlobalContext);
  const { subjectId } = useParams();
  const subject = subjects.find((subject) => subject.id === subjectId);
  const [questions, setQuestions] = useState(subject.questions);

  const title = `Gabarito - ${subject.subject} (${questions.length})`;

  useEffect(() => {
    document.title = title;
  }, [subject]);

  const onSearch = (text) => {
    setQuestions(subject.questions.filter((question) => textMatch(question.description.join(' '), text)));
  };

  return (
    <>
      <Header
        title={title}
        backButton='/'
        extend={(
          <>
            <SearchField onChange={onSearch} />
            <PrintButton />
          </>
        )}
      />
      <Container sx={{ py: 4 }}>
        <QuestionsContainer>
          {questions.map((question) => (
            <Question
              question={question}
              key={question.id}
              readOnly
            />
          ))}
        </QuestionsContainer>
      </Container>
    </>
  );
};

export default Answers;
