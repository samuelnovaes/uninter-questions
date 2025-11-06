import { Box } from "@mui/material";
const QuestionsContainer = ({ children }) => (
  <Box
    sx={{
      display: "grid",
      gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" },
      gap: 2,
    }}
  >
    {" "}
    {children}{" "}
  </Box>
);
export default QuestionsContainer;
