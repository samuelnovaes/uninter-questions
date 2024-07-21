import { Box, Card, CardContent, Divider, FormControlLabel, Radio, RadioGroup } from '@mui/material';
import parse from 'html-react-parser';
import { Fragment } from 'react';

const Question = ({
  question,
  readOnly,
  onChange
}) => {
  const handleChange = (event) => {
    if (onChange) {
      onChange(event.target.value);
    }
  };

  const rightValue = question.options.find((option) => option.rightAnswer).name;

  return (
    <Card>
      <CardContent>
        {question.description.map((text, i) => (
          <Fragment key={i}>
            {parse(text)}
          </Fragment>
        ))}
      </CardContent>
      <Divider />
      <CardContent>
        <RadioGroup
          onChange={handleChange}
          value={readOnly && rightValue}
          sx={{ gap: 2 }}
        >
          {question.options.map((option) => (
            <FormControlLabel
              key={option.name}
              value={option.name}
              control={
                <Radio
                  disabled={readOnly}
                  sx={{ transform: 'translateY(-9px)' }}
                />
              }
              label={(
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 1
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

