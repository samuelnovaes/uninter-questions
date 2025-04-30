import styled from '@emotion/styled';
import { Search } from '@mui/icons-material';
import { IconButton, InputAdornment, OutlinedInput } from '@mui/material';
import { useEffect, useState } from 'react';

const MobileSearch = styled.div({
  display: 'block',
  ['@media (width >= 728px)']: {
    display: 'none'
  }
});

const DesktopSearch = styled.div({
  display: 'block',
  ['@media (width < 728px)']: {
    display: 'none'
  }
});

const Field = ({
  mobile,
  value,
  setValue,
  setOpenSearch = () => { }
}) => {
  const handleKeyDown = (event) => {
    if(event.key === 'Enter') {
      setOpenSearch(false);
    }
  };
  return (
    <OutlinedInput
      sx={{
        ...mobile && {
          position: 'absolute',
          width: 'calc(100vw - 32px)',
          top: 8,
          left: 16,
          zIndex: 1
        }
      }}
      autoFocus
      placeholder='Buscar...'
      size='small'
      onChange={(event) => setValue(event.target.value)}
      value={value}
      onBlur={() => setOpenSearch(false)}
      onKeyDown={handleKeyDown}
      endAdornment={
        <InputAdornment position='end'>
          <Search />
        </InputAdornment>
      }
    />
  );
};

const SearchField = ({ onChange }) => {
  const [value, setValue] = useState('');
  const [openSearch, setOpenSearch] = useState(false);

  useEffect(() => {
    onChange(value);
  }, [value]);

  return (
    <>
      <DesktopSearch>
        <Field value={value} setValue={setValue} />
      </DesktopSearch>
      <MobileSearch>
        {openSearch && (
          <Field
            mobile
            value={value}
            setValue={setValue}
            setOpenSearch={setOpenSearch}
          />
        )}
        {!openSearch && (
          <IconButton onClick={() => setOpenSearch(true)}>
            <Search />
          </IconButton>
        )}
      </MobileSearch>
    </>
  );
};

export default SearchField;
