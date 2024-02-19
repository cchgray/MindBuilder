import React from 'react';


import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import { ThemeProvider, createTheme } from '@mui/material/styles';

//import Footer from './components/Footer';
import SectionA from './components/SectionA';
import SectionB from './components/SectionB';
import SectionC from './components/SectionC';

import getLPTheme from './getLPTheme';





export default function Home() {
  const LPtheme = createTheme(getLPTheme('light'));




  return (
    <ThemeProvider theme={LPtheme}>
      <CssBaseline />
      
      <Box sx={{ bgcolor: 'background.default' }}>
        
        <SectionA />
        <Divider />
        <SectionB />
        <Divider />
        <SectionC />
        {/* <Footer /> */}
      </Box>
      
    </ThemeProvider>
  );
}