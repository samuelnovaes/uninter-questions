import { useContext, useState } from 'react';
import Header from '../components/Header';
import { RepositoryContext } from '../providers/RepositoryProvider';
import { Button, Card, Container, List, ListItem, ListItemSecondaryAction, ListItemText } from '@mui/material';
import textMatch from '../utils/textMatch';
import { Link } from 'react-router-dom';
import SearchField from '../components/SearchField';

const SubjectsPage = () => {
  const allSubjects = useContext(RepositoryContext);
  const [subjects, setSubjects] = useState(allSubjects);

  const onSearch = (text) => {
    setSubjects(allSubjects.filter((subject) => textMatch(subject.subject, text)));
  };

  return (
    <>
      <Header
        title='Disciplinas'
        extend={<SearchField onChage={onSearch} />}
      />
      <Container sx={{ py: 4 }}>
        {subjects.length > 0 && (
          <Card>
            <List>
              {subjects.map((subject) => (
                <ListItem key={subject.id}>
                  <ListItemText>{subject.subject} ({subject.questions.length} questões)</ListItemText>
                  <ListItemSecondaryAction sx={{ display: 'flex', gap: 1 }}>
                    <Link to={`/exam/${subject.id}`}>
                      <Button variant='contained' size='small'>Simulado</Button>
                    </Link>
                    <Link to={`/answers/${subject.id}`}>
                      <Button variant='contained' size='small'>Gabarito</Button>
                    </Link>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </Card>
        )}
      </Container>
    </>
  );
};

export default SubjectsPage;

