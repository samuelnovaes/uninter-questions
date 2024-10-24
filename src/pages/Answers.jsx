import { useParams } from 'react-router-dom';
import Header from '../components/Header';
import { useContext, useState } from 'react';
import textMatch from '../utils/textMatch';
import { Container } from '@mui/material';
import Question from '../components/Question';
import QuestionsContainer from '../components/QuestionsContainer';
import SearchField from '../components/SearchField';
import { GlobalContext } from '../GlobalProvider';

const Answers = () => {
  const { subjects } = useContext(GlobalContext);
  const { subjectId } = useParams();
  const subject = subjects.find((subject) => subject.id === subjectId);
  const [questions, setQuestions] = useState(subject.questions);

  const onSearch = (text) => {
    setQuestions(subject.questions.filter((question) => {
      const fullText = question.description.reduce((result, description) => `${result} ${description}`, '');
      return textMatch(fullText, text);
    }));
  };

  return (
    <>
      <Header
        title={`Gabarito - ${subject.subject}`}
        backButton='/'
        extend={<SearchField onChange={onSearch} />}
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
