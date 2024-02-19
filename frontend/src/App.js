import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Home from './containers/LandingPage/Home';
import Login from './containers/Login';
import Signup from './containers/Signup';
import Activate from './containers/Activate';
import ResetPassword from './containers/ResetPassword';
import ResetPasswordConfirm from './containers/ResetPasswordConfirm.js';
import UserProfile from './containers/UserProfile'; 
import CoachDashboard from './containers/CoachDashboard';
import Explore from './containers/Explore';
import AboutPage from './containers/AboutPage';
import GroupView from './containers/GroupView';
import GroupViewUserView from './containers/GroupViewUserView';
// import Facebook from './containers/Facebook';
// import Google from './containers/Google';

import { Provider } from 'react-redux';
import store from './store';

import Layout from './hocs/Layout';
import CoachView from './containers/CoachView';

const App = () => (
    <Provider store={store}>
        <Router>
            <Layout>
                <Routes>
                    <Route path='/' element={<Home />} />
                    <Route path='/login' element={<Login />} />
                    <Route path='/signup' element={<Signup />} />
                    {/* <Route path='/facebook' element={<Facebook />} />
                    <Route path='/google' element={<Google />} /> */}
                    <Route path='/reset-password' element={<ResetPassword />} />
                    <Route path='/password/reset/confirm/:uid/:token' element={<ResetPasswordConfirm />} />
                    <Route path='/activate/:uid/:token' element={<Activate />} />
                    <Route path='/me' element={<UserProfile />} /> 
                    <Route path='/coach-dashboard' element={<CoachDashboard />} />
                    <Route path='/explore' element={<Explore />} />
                    <Route path='/coach-view/' element={<CoachView />} />
                    <Route path='/about/:userId' element={<AboutPage />} />
                    <Route path='/group/:groupId' element={<GroupView />} />
                    <Route path='/group-user-view/:groupId' element={<GroupViewUserView />} />
                </Routes>
            </Layout>
        </Router>
    </Provider>
);

export default App;