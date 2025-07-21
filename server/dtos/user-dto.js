class UserDTO {
  username;
  userId;
  groups;
  constructor(userData) {
    this.username = userData.username;
    this.userId = userData._id;
    this.groups = userData.groups;
  }
}

export { UserDTO };
