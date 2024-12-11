import styled from '@emotion/styled';
import { Search } from '@mui/icons-material';
import { Dialog, DialogContent, IconButton, InputAdornment, OutlinedInput } from '@mui/material';
import { useEffect, useState } from 'react';
import DialogClose from './DialogClose';

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

const SearchField = ({ onChange }) => {
  const [value, setValue] = useState('');
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    onChange(value);
  }, [value]);

  return (
    <>
      <DesktopSearch>
        <OutlinedInput
          placeholder='Buscar...'
          size='small'
          onChange={(event) => setValue(event.target.value)}
          value={value}
          endAdornment={
            <InputAdornment position='end'>
              <Search />
            </InputAdornment>
          }
        />
      </DesktopSearch>
      <MobileSearch>
        <IconButton onClick={() => setOpenDialog(true)}>
          <Search />
        </IconButton>
      </MobileSearch>
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogContent>
          <OutlinedInput
            size='small'
            placeholder='Buscar...'
            onChange={(event) => setValue(event.target.value)}
            value={value}
          />
        </DialogContent>
        <DialogClose onClick={() => setOpenDialog(false)} />
      </Dialog>
    </>
  );
};

export default SearchField;
