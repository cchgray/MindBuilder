import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import api from '../actions/api-config';
import { Link } from 'react-router-dom';
import { getUsersByCoach } from '../actions/auth';


const Explore = ({ user, getUsersByCoach, usersByCoach }) => {
    const [searchResults, setSearchResults] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    const [dataFetched, setDataFetched] = useState(false);

    useEffect(() => {
        // Fetch initial search results when component mounts
        if (user && !dataFetched) { // Only fetch data if user exists and data hasn't been fetched yet
            
            performPlayerSearch();
            
            setDataFetched(true); // Set dataFetched to true after fetching data
            getUsersByCoach(user.id);
        }
    }, [user, dataFetched, getUsersByCoach]);

    const handleAssignCoach = async (user_id, coach_id) => {
        
        try {
            await api.post(
                `/accounts/assign-coach/`, // Replace with your actual API endpoint
                { user_id, coach_id },  // Send user_id and coach_id in the request data
                {
                    headers: {
                        'Authorization': `JWT ${localStorage.getItem('access')}`,
                    },
                }
            );
            //console.log('Coach assigned successfully');
            
        } catch (error) {
            console.error('Error assigning coach:', error);
        }
        
    };

    const performPlayerSearch = async () => {
        try {
            const response = await api.get(`/accounts/player-users/`, {
                headers: {
                    'Authorization': `JWT ${localStorage.getItem('access')}`,
                },
            });

            setSearchResults(response.data);
        } catch (error) {
            console.error('Error fetching search results:', error);
        }
    };

    const filteredSearchResults = searchResults.filter(result => {
        // Check if the searchQuery is empty or matches the result's name
        const matchesSearchQuery = searchQuery === '' || 
            (result.first_name + ' ' + result.last_name).toLowerCase().includes(searchQuery.toLowerCase());
    
        // Check if result.id is not in pendingRequests
        const notUserOfCoach = !usersByCoach.some(user => user.id === result.id);
    
        // Include the result only if it matches both criteria
        return matchesSearchQuery && notUserOfCoach;
    });
    

    return (
        <div className="explore-container">
            <h2>Explore</h2>
        
            <div className="mt-4">
                <h2>Search for Coaches or Players</h2>
                <div className="input-group mb-3">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search for coaches or players..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>
            <div className="mt-4">
                <div className="search-results">
                    {filteredSearchResults.length > 0 ? (
                        <ul className="list-group">
                            {filteredSearchResults.map(result => (
                                <li
                                    key={result.id}
                                    className="list-group-item d-flex justify-content-between align-items-center"
                                >
                                    {result.first_name} {result.last_name}
                                    <button
                                        className="btn btn-primary"
                                        onClick={() => handleAssignCoach(result.id, user.id)}
                                    >
                                        Assign Player
                                    </button>
                                    <Link to={`/about/${result.id}`} className="btn btn-secondary">
                                        View Profile
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No results found.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

const mapStateToProps = (state) => ({
    user: state.auth.user,
    usersByCoach: state.auth.usersByCoach || [],
});
const mapDispatchToProps = (dispatch) => ({
    getUsersByCoach: (coachId) => dispatch(getUsersByCoach(coachId)),
  });
  
export default connect(mapStateToProps, mapDispatchToProps)(Explore);

