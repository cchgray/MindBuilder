import React, { Fragment } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { connect } from 'react-redux';
import { logout } from '../actions/auth';

const Navbar = ({ logout, isAuthenticated, userRole }) => {
    //const [redirect, setRedirect] = useState(false);
    const location = useLocation();

    const logout_user = async () => {
        await logout();
    };

    

    const guestLinks = () => (
        <Fragment>
            <li className='nav-item'>
                <Link className={`nav-link ${location.pathname === '/login' ? 'active' : ''}`} to='/login'>Login</Link>
            </li>
            <li className='nav-item'>
                <Link className={`nav-link ${location.pathname === '/signup' ? 'active' : ''}`} to='/signup'>Sign Up</Link>
            </li>
        </Fragment>
    );

    const authLinks = (userRole) => (
        <Fragment>
            {userRole === 'coach' ? (
                <li className='nav-item'>
                    <Link className={`nav-link ${location.pathname === '/coach-dashboard' ? 'active' : ''}`} to='/coach-dashboard'>Dashboard</Link>
                </li>
            ) : (
                <li className='nav-item'>
                    <Link className={`nav-link ${location.pathname === '/me' ? 'active' : ''}`} to='/me'>Profile</Link>
                </li>
            )}
            <li className='nav-item'>
                <a className='nav-link' href='/' onClick={logout_user}>Logout</a>
            </li>
            {userRole === 'coach' && (
                <li className='nav-item'>
                    <Link className={`nav-link ${location.pathname === '/explore' ? 'active' : ''}`} to='/explore'>Find Users</Link>
                </li>
            )}
        </Fragment>
    );

    return (
        <Fragment>
            <nav className='navbar navbar-expand-lg navbar-light bg-light'>
                <Link className='navbar-brand' to='/'>Mind Gym</Link>
                <button 
                    className='navbar-toggler' 
                    type='button' 
                    data-toggle='collapse' 
                    data-target='#navbarNav' 
                    aria-controls='navbarNav' 
                    aria-expanded='false' 
                    aria-label='Toggle navigation'
                >
                    <span className='navbar-toggler-icon'></span>
                </button>
                <div className='collapse navbar-collapse' id='navbarNav'>
                    <ul className='navbar-nav'>
                        <li className={`nav-item ${location.pathname === '/' ? 'active' : ''}`}>
                            <Link className='nav-link' to='/'>Home <span className='sr-only'>(current)</span></Link>
                        </li>
                        {isAuthenticated ? authLinks(userRole) : guestLinks()}
                    </ul>
                </div>
            </nav>
            {/* {redirect ? <Navigate to='/' /> : <Fragment></Fragment>} */}
        </Fragment>
    );
};

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated,
    userRole: state.auth.user ? state.auth.user.role : null,
});

export default connect(mapStateToProps, { logout })(Navbar);
