import styled from '@emotion/styled';
import { Search } from '@mui/icons-material';
import { Button, Dialog, DialogActions, DialogContent, IconButton, Input, InputAdornment } from '@mui/material';
import { useEffect, useState } from 'react';

const MobileSearch = styled.div`
  display: block;
  @media (width >= 728px) {
    display: none;
  }
`;

const DesktopSearch = styled.div`
  display: block;
  @media (width < 728px) {
    display: none;
  }
`;

const SearchField = ({ onChange }) => {
  const [value, setValue] = useState('');
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    onChange(value);
  }, [value]);

  return (
    <>
      <DesktopSearch>
        <Input
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
          <Input
            placeholder='Buscar...'
            onChange={(event) => setValue(event.target.value)}
            value={value}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Fechar</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default SearchField;
