import { useContext, useEffect, useState } from 'react';
import Header from '../components/Header';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Container,
  Divider,
  Typography,
} from '@mui/material';
import textMatch from '../utils/textMatch';
import { Link } from 'react-router-dom';
import SearchField from '../components/SearchField';
import QuestionsContainer from '../components/QuestionsContainer';
import { GlobalContext } from '../GlobalProvider';
import useSessionStorage from '../hooks/useStorage';
import { useTheme } from '@mui/material/styles';

const SubjectsPage = () => {
  const { subjects: allSubjects } = useContext(GlobalContext);
  const [subjects, setSubjects] = useState(allSubjects);
  const [searchText, setSearchText] = useSessionStorage('subjectsSearch', '');
  const theme = useTheme();
  const simuladoPalette = theme.palette.buttons.simulado;
  const gabaritoPalette = theme.palette.buttons.gabarito;
  const cardPalette = theme.palette.cards?.subjects;

  const onSearch = (text) => {
    setSearchText(text);
    setSubjects(
      allSubjects.filter((subject) => textMatch(subject.subject, text))
    );
  };

  useEffect(() => {
    document.title = 'Disciplinas';
  }, []);

  return (
    <>
      <Header
        title='DISCIPLINAS'
        extend={<SearchField onChange={onSearch} initialValue={searchText} />}
      />
      <Container sx={{ py: 4 }}>
        <QuestionsContainer>
          {subjects.map((subject) => (
            <Card
              key={subject.id}
              variant='outlined'
              sx={{
                backgroundColor: cardPalette.background,
                color: cardPalette.color,
                fontSize: '18px',
                fontWeight: 'bold',
                borderRadius: '8px',
              }}
            >
              <CardContent>
                <p>{subject.subject}</p>
                <Typography variant='caption' component='p'>
                  {subject.questions.length} questões
                </Typography>
              </CardContent>
              <Divider />
              <CardActions>
                <Link to={`/exam/${subject.id}`}>
                  <Button
                    variant='contained'
                    size='small'
                    sx={{
                      backgroundColor: simuladoPalette.main,
                      color: simuladoPalette.contrastText,
                      fontWeight: 'bold',
                    }}
                  >
                    Simulado
                  </Button>
                </Link>
                <Link to={`/answers/${subject.id}`}>
                  <Button
                    variant='contained'
                    size='small'
                    sx={{
                      backgroundColor: gabaritoPalette.main,
                      color: gabaritoPalette.contrastText,
                      border: gabaritoPalette.border,
                      fontWeight: 'bold',
                    }}
                  >
                    Gabarito
                  </Button>
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