const userModel = require("../models/userModel").userModel;

const getUserByEmailIdAndPassword = (email, password) => {
  let user = userModel.findOne(email);
  if (user) {
    if (isUserValid(user, password)) {
      return user;
    }
  }
  return null;
};
const getUserById = (id) => {
  let user = userModel.findById(id);
  if (user) {
    return user;
  }
  return null;
};

function isUserValid(user, password) {
  return user.password === password;
}

const getUserByGitHubIdOrCreate = (profile) =>{
  // Check to see if we have a user already in our DB with the id that matches their github profile
  let user = userModel.findById(profile.id);
  if(user){
    return user;
  }

  // If we don't have them, add them to DB
  let createdUser = userModel.createUserWithGithubId(profile);
  return createdUser;
};

module.exports = {
  getUserByEmailIdAndPassword,
  getUserById,
  getUserByGitHubIdOrCreate
};
