// AttemptHistory.js
import React, { useState, useEffect } from 'react';
import HistoryAttempt from './HistoryAttempt';
import historyService from "../../services/history";
import { getUserFromToken } from "./utils/authUtils";
// import {jwtDecode} from "jwt-decode";
// import userService from "../../services/users";

// export async function getUserFromToken() {
//     const jwtToken = sessionStorage.getItem('jwt_token');
//     if (jwtToken) {
//         const decodedToken = jwtDecode(jwtToken);
//         try {
//             // decodedToken has an id field in auth-controller.js
//             // user fetched by id has a username field in user-model.js
//             const id = decodedToken.id;
//             const user = await userService.getUser(
//                 decodedToken.id, {headers: {Authorization: `Bearer ${jwtToken}`}})
//             // getUser return an Object with data, message, and type
//             // The user data is nested in Object.data and hence we need a double .data to access it
//             return {id: id, username: user.data.data.username};
//         } catch (error) {
//             console.error(error);
//             return "No User";
//         }
//     }
//     return "No User";
// }


const HistoryTable = ({userID}) => {
    // const [userID, setUserID] = useState(null);
    const [history, setHistory] = useState([]);

    // useEffect(() => {
    //     async function fetchData() {
    //         try {
    //             const user = await getUserFromToken();
    //             if (user) {
    //                 setUserID(user.userId); // asynchronous
    //                 const result = await historyService.getHistoryByUserId(user.userId);
    //                 setHistory(result.data);
    //                 console.log(`I have gotten the user id: ${user.userId}`)
    //             }
    //         } catch (error) {
    //             console.error('Error fetching attempt history:', error);
    //         }
    //     }
    //     fetchData();
    // }, []);

    useEffect(() => {
        async function fetchData() {
            try {
                if (userID) {
                    const result = await historyService.getHistoryByUserId(userID);
                    setHistory(result.data);
                    console.log(`I have gotten the user id in table: ${userID}`)
                }
            } catch (error) {
                console.error('Error fetching attempt history:', error);
            }
        }
        fetchData();
    }, []);

    return (
        <div className="history-table">
            <h2>Attempt History</h2>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>Matched User</th>
                        <th>Question</th>
                        <th>Start Time</th>
                        <th>Duration</th>
                        <th>Code</th>
                    </tr>
                </thead>
                <tbody>
                    {history.map((attempt, index) => (
                        <HistoryAttempt key={index} attempt={attempt} />
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default HistoryTable;
