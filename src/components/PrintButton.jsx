import { Print } from '@mui/icons-material';
import { IconButton } from '@mui/material';

const PrintButton = () => {
  const handleClick = () => {
    window.print();
  };
  return (
    <IconButton onClick={handleClick}>
      <Print />
    </IconButton>
  );
};

export default PrintButton;
