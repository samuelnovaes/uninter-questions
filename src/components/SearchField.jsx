import { Search } from '@mui/icons-material';
import { Input, InputAdornment } from '@mui/material';

const SearchField = ({ onChage }) => (
  <Input
    placeholder='Buscar...'
    size='small'
    onChange={(event) => onChage(event.target.value)}
    endAdornment={
      <InputAdornment position='end'>
        <Search />
      </InputAdornment>
    }
  />
);

export default SearchField;
