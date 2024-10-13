// TODO: Matching users logic


const { notifyUsers } = require('../websocket/websocket')
// local dict to store waiting users
const waitingUsers = {};
const timeoutMap = {};

// function matchUsers(userId, language, difficulty) {
//     const criteriaKey = `${difficulty}.${language}`;

//     // if the criteria key does not exist, create it
//     if (!waitingUsers[criteriaKey]) {
//         waitingUsers[criteriaKey] = [];
//     }

//     waitingUsers[criteriaKey].push(userId);
//     console.log(`User ${userId} added to ${criteriaKey}. Waiting list: ${waitingUsers[criteriaKey].length}`);

//     // Check if there are 2 or more users waiting for this criteria
//     if (waitingUsers[criteriaKey].length >= 2) {
//         const matchedUsers = waitingUsers[criteriaKey].splice(0, 2); // Match the first two users
//         console.log(`Matched users: ${matchedUsers}`);
        
//         // Send match success (this could trigger WebSocket communication)
//         notifyUsers(matchedUsers);
//         return true;
//     }

//     return false;
// }

function matchUsers(channel, msg, userId, language, difficulty) {
  const criteriaKey = `${difficulty}.${language}`;

  // If the criteria key does not exist, create it
  if (!waitingUsers[criteriaKey]) {
      waitingUsers[criteriaKey] = [];
  }

  waitingUsers[criteriaKey].push({ userId, msg }); // Store both userId and the message
  console.log(`User ${userId} added to ${criteriaKey}. Waiting list: ${waitingUsers[criteriaKey].length}`);

  // Check if there are 2 or more users waiting for this criteria
  if (waitingUsers[criteriaKey].length >= 2) {
      const matchedUsers = waitingUsers[criteriaKey].splice(0, 2); // Match the first two users
      console.log(`Matched users: ${matchedUsers.map(user => user.userId)}`);

      // Send match success (this could trigger WebSocket communication)
      notifyUsers(matchedUsers.map(user => user.userId));

      // Acknowledge the messages for both matched users
      matchedUsers.forEach(({ msg }) => {
          acknowledgeMessage(channel, msg);
      });

      return true;
  }

  return false;
}

async function acknowledgeMessage(channel, msg) {
  return new Promise((resolve, reject) => {
      try {
          channel.ack(msg);
          console.log(`Acknowledged message for user: ${JSON.parse(msg.content).userId}`);
          clearTimeout(timeoutMap[JSON.parse(msg.content).userId]); // Clear any pending timeout
          delete timeoutMap[JSON.parse(msg.content).userId]; // Clean up
          resolve();
      } catch (error) {
          console.error(`Failed to acknowledge message:`, error);
          reject(error);
      }
  });
}

async function rejectMessage(channel, msg, userId) {
  return new Promise((resolve, reject) => {
      try {
          channel.reject(msg, false); // Reject without requeuing
          console.log(`Rejected message for user: ${userId}`);
          resolve();
      } catch (error) {
          console.error(`Failed to reject message for user ${userId}:`, error);
          reject(error);
      }
  });
}

module.exports = { matchUsers, rejectMessage };
