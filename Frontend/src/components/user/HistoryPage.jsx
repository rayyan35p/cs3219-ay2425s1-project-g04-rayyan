import React, { useState, useEffect } from 'react';
import NavigationBar from '../NavigationBar';
import HistoryTable from './HistoryTable';
import ProfileSidebar from './ProfileSidebar';
import { getUserFromToken } from "./utils/authUtils";


// change the model: include qn title and matched user's name, and the time the session is started
// session starttime: maybe look at websocket level
// when session is started, extract question title (and description)
// when ending session, save the info. need to avoid duplicate based on user id, matched user and start time


function HistoryPage() {
    const [userID, setUserID] = useState(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const user = await getUserFromToken();
                if (user) {
                    setUserID(user.userId); // asynchronous
                    console.log(`I have gotten the user id in history page: ${user.userId}`)
                }
            } catch (error) {
                console.error('Error fetching user ID in history page component:', error);
            }
        }
        fetchData();
    }, []);
    


    return(
        <div>
            <NavigationBar/>
            <div className="row">
                <div className="Navbar col-2">
                    <ProfileSidebar userID={userID}/>
                </div>
                <div className="col-10">
                    <HistoryTable userID={userID}/>
                </div>
            </div>
        </div>
    );
}

export default HistoryPage;