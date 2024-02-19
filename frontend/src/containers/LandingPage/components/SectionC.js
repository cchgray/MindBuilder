import * as React from 'react';
import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';



export default function SectionC() {
  return (
    <Container className='SectionC'  sx={{ py: { xs: 6, sm: 6 } }}>
      <Typography component="h2" variant="h4" color="text.primary" p={2} gutterBottom>Integrated Messaging</Typography>
      <Grid container spacing={3} alignItems="stretch">
        <Grid item xs={12}>
          <Card>
            <Grid container direction="column" p={2}>
              {/* Top section */}
              <Grid item>
                <Typography variant="h4" gutterBottom>
                An integrated inbox for effortless communication
                </Typography>
              </Grid>

                        <Card 
                          variant="outlined"
                          sx={{
                            height: '75%',
                            width: '75%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                          >
                          <img src="/mountainlandscape.jpeg" alt="Mountain Landscape" style={{ maxWidth: '50%', maxHeight: '50%' }} />
                        </Card>
                    <Typography variant="body1" p={2} gutterBottom>
                    At the heart of Mind Builder lies a revolutionary software designed to empower mental performance consultants and sports psychologists.
                    </Typography>
                  
              </Grid>
          </Card>
            </Grid>
        
      </Grid>
    </Container>
  );
}
