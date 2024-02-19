import * as React from 'react';
import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import { List, ListItem, Typography } from '@mui/material';


export default function SectionB() {
  return (
    <Container className='SectionB'  sx={{ py: { xs: 6, sm: 6 } }}>
      <Typography component="h2" variant="h4" color="text.primary" p={2} gutterBottom>Features</Typography>
      <Grid container spacing={3} alignItems="stretch">
        <Grid item xs={12}>
          <Card>
            <Grid container direction="column" p={2}>
              {/* Top section */}
              <Grid item>
                <Typography variant="h4" gutterBottom>
                  Prescribe personalized mental fitness workouts in an intuitive calendar format
                </Typography>
              </Grid>

              {/* Bottom section */}
              <Grid item container spacing={2}>
                {/* Left side */}
                <Grid item xs={12} md={6}>
                  <Grid container direction="column">
                  <List component="nav" aria-label="essential topics">
                    <Typography variant="h5" gutterBottom>
                      Cover essential topics:
                    </Typography>
                    <ListItem>
                      <Typography variant="body3">Focus & Concentration</Typography>
                    </ListItem>
                    <ListItem>
                      <Typography variant="body3">Breathing Techniques</Typography>
                    </ListItem>
                    <ListItem>
                      <Typography variant="body3">Goal Setting</Typography>
                    </ListItem>
                    <ListItem>
                      <Typography variant="body3">Reflection</Typography>
                    </ListItem>
                    <ListItem>
                      <Typography variant="body3">Imagery/Visualization</Typography>
                    </ListItem>
                    <ListItem>
                      <Typography variant="body3">Stress Management</Typography>
                    </ListItem>
                  </List>
                  </Grid>
                </Grid>

                {/* Right side */}
                <Grid item xs={12} md={6}>
                      <Grid container justify="center">
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
                          <img src="/mountainlandscape.jpeg" alt="Mountain Landscape" style={{ maxWidth: '100%', maxHeight: '100%' }} />
                        </Card>
                      </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Card>
        </Grid>
        
        <Grid item xs={12} > 
          <Card>
            <Grid container direction="column" p={2}>
                  {/* Top section */}
                  <Typography variant="h4" gutterBottom>
                    Athletes provide insights through a dynamic feedback loop
                  </Typography>

                  {/* Bottom section */}
                  <Grid container spacing={2}>
                    {/* Left side */}
                    <Grid item xs={12} md={6}>
                      <Grid container justify="center">
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
                          <img src="/mountainlandscape.jpeg" alt="Mountain Landscape" style={{ maxWidth: '100%', maxHeight: '100%' }} />
                        </Card>
                      </Grid>
                    </Grid>

                    {/* Right side */}
                    <Grid item xs={12} md={6}>
                    <Grid container direction="column">
                  <List component="nav" aria-label="essential topics">
                    <Typography variant="h5" gutterBottom>
                      Cover essential topics:
                    </Typography>
                    <ListItem>
                      <Typography variant="body3">Track completion of exercises</Typography>
                    </ListItem>
                    <ListItem>
                      <Typography variant="body3">Monitor progress with precision</Typography>
                    </ListItem>
                    <ListItem>
                      <Typography variant="body3">Celebrate achievements</Typography>
                    </ListItem>
                    <ListItem>
                      <Typography variant="body3">Adapt strategies for optimal results</Typography>
                    </ListItem>
                  </List>
                  </Grid>
                      
                    </Grid>
                  </Grid>
            </Grid>
          </Card>
        </Grid> 

        <Grid item xs={12}>
          <Card>
            <Grid container direction="column" p={2}>
              {/* Top section */}
              <Grid item>
                <Typography variant="h4" gutterBottom>
                  Teams
                </Typography>
              </Grid>

              {/* Bottom section */}
              <Grid item container spacing={2}>
                {/* Left side */}
                <Grid item xs={12} md={6}>
                  <Grid container direction="column">
                  <List component="nav" aria-label="essential topics">
                    <Typography variant="h5" gutterBottom>
                    Group calendar for coaches to prescribe exercises to Teams:
                    </Typography>
                    <ListItem>
                      <Typography variant="body3">Exercises prescribed to teams</Typography>
                    </ListItem>
                    <ListItem>
                      <Typography variant="body3">Social walls</Typography>
                    </ListItem>
                    <ListItem>
                      <Typography variant="body3">Engaging mechanism for Teams to collaborate and provide accountability</Typography>
                    </ListItem>
                   
                  </List>
                  </Grid>
                </Grid>

                {/* Right side */}
                <Grid item xs={12} md={6}>
                      <Grid container justify="center">
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
                          <img src="/mountainlandscape.jpeg" alt="Mountain Landscape" style={{ maxWidth: '100%', maxHeight: '100%' }} />
                        </Card>
                      </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}
