import { Box, Card, CardContent, Divider, FormControlLabel, Radio, RadioGroup, useTheme } from '@mui/material';
import parse from 'html-react-parser';
import { Fragment, useState } from 'react';

const Question = ({
  question,
  readOnly,
  onChange,
  finished
}) => {
  const [value, setValue] = useState(null);
  const theme = useTheme();

  const handleChange = (event) => {
    const newValue = event.target.value;
    setValue(newValue);
    if (onChange) {
      onChange(newValue);
    }
  };

  const rightValue = question.options.find((option) => option.rightAnswer)?.name;

  const getOptionColor = (name) => {
    if (name === rightValue && (finished || readOnly)) {
      return theme.palette.success.main;
    }
    if (finished && name === value && name !== rightValue) {
      return theme.palette.error.main;
    }
    return theme.palette.text.primary;
  };

  return (
    <Card variant='outlined' sx={{ width: '100%' }}>
      <CardContent sx={{ ['& img']: { maxWidth: '100%' } }}>
        {question.description.map((text, i) => (
          <Fragment key={i}>
            {parse(text)}
          </Fragment>
        ))}
      </CardContent>
      <Divider />
      <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'flex-start' }}>
        <RadioGroup
          onChange={handleChange}
          value={readOnly ? rightValue : value}
          sx={{ gap: 2 }}
        >
          {question.options.map((option) => (
            <FormControlLabel
              key={option.name}
              value={option.name}
              control={
                <Radio
                  disabled={readOnly || finished}
                  sx={{ transform: 'translateY(-9px)' }}
                />
              }
              label={(
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 1,
                    color: getOptionColor(option.name)
                  }}
                >
                  <strong>{option.name})</strong>
                  <Box
                    sx={{
                      '& p': {
                        margin: 0
                      }
                    }}
                  >
                    {parse(option.description)}
                  </Box>
                </Box>
              )}
              sx={{
                alignItems: 'flex-start',
                gap: 1
              }}
            />
          ))}
        </RadioGroup>
      </CardContent>
    </Card>
  );
};

export default Question;

