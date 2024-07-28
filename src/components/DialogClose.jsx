import { Button, DialogActions, Divider } from '@mui/material';

const DialogClose = ({ onClick }) => (
  <>
    <Divider />
    <DialogActions
      sx={{ justifyContent: 'center' }}
    >
      <Button variant='contained' onClick={onClick}>Fechar</Button>
    </DialogActions>
  </>
);

export default DialogClose;
