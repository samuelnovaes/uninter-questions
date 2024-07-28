import { useContext, useState } from 'react';
import Header from '../components/Header';
import { Button, Card, CardActions, CardContent, Container, Divider, Typography } from '@mui/material';
import textMatch from '../utils/textMatch';
import { Link } from 'react-router-dom';
import SearchField from '../components/SearchField';
import QuestionsContainer from '../components/QuestionsContainer';
import { GlobalContext } from '../GlobalProvider';

const SubjectsPage = () => {
  const { subjects: allSubjects } = useContext(GlobalContext);
  const [subjects, setSubjects] = useState(allSubjects);

  const onSearch = (text) => {
    setSubjects(allSubjects.filter((subject) => textMatch(subject.subject, text)));
  };

  return (
    <>
      <Header
        title='Disciplinas'
        extend={<SearchField onChange={onSearch} />}
      />
      <Container sx={{ py: 4 }}>
        <QuestionsContainer>
          {subjects.map((subject) => (
            <Card key={subject.id} variant='outlined'>
              <CardContent>
                <p>{subject.subject}</p>
                <Typography variant='caption' component='p'>{subject.questions.length} questões</Typography>
              </CardContent>
              <Divider />
              <CardActions>
                <Link to={`/exam/${subject.id}`}>
                  <Button variant='contained' size='small'>Simulado</Button>
                </Link>
                <Link to={`/answers/${subject.id}`}>
                  <Button variant='contained' size='small'>Gabarito</Button>
                </Link>
              </CardActions>
            </Card>
          ))}
        </QuestionsContainer>
      </Container>
    </>
  );
};

export default SubjectsPage;

