// return: Random unique ID that is in order to the time it was created
export const generateUniqueID = () => {
  return Date.now().toString(36) + Math.floor(Math.pow(10, 12) + Math.random() * 9*Math.pow(10, 12)).toString(36)
}

// return: The ID of an active game of the user or null if there is no active game
export const getActiveGameID = (userSnap) => {
  const userGames =  userSnap.data().games
  for (var gameID in userGames) {
    if (userGames[gameID].active === true) {
      return gameID; // Return the ID if active is true
    }
  } 
return null; // Return null if no active entry is found
}