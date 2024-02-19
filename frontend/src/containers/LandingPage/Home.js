import React from 'react';
import PropTypes from 'prop-types';


import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';

//import Footer from './components/Footer';
import SectionA from './components/SectionA';
import SectionB from './components/SectionB';
import SectionC from './components/SectionC';

import getLPTheme from './getLPTheme';



function ToggleCustomTheme({ showCustomTheme, toggleCustomTheme }) {      
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100dvw',
        position: 'fixed',
        bottom: 24,
      }}
    >
      <ToggleButtonGroup
        color="primary"
        exclusive
        value={showCustomTheme}
        onChange={toggleCustomTheme}
        aria-label="Platform"
        sx={{
          backgroundColor: 'background.default',
          '& .Mui-selected': {
            pointerEvents: 'none',
          },
        }}
      >
        <ToggleButton value>
          <AutoAwesomeRoundedIcon sx={{ fontSize: '20px', mr: 1 }} />
          Custom theme
        </ToggleButton>
        {/* <ToggleButton value={false}>
          <SvgMaterialDesign sx={{ fontSize: '20px', mr: 1 }} />
          Material Design
        </ToggleButton> */}
      </ToggleButtonGroup>
    </Box>
  );
}

ToggleCustomTheme.propTypes = {
  showCustomTheme: PropTypes.shape({
    valueOf: PropTypes.func.isRequired,
  }).isRequired,
  toggleCustomTheme: PropTypes.func.isRequired,
};

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