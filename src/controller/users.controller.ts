import User from "../interface/user"


class UsersController {

  _users = {}
    
  async addUser(user: User) {
    if (!this.users[user.deviceId]) {
      this.users[user.deviceId] = user
    }else{
      this.users[user.deviceId].fcmToken = user.fcmToken
    }
  }

  getUser(deviceId) {
    return this.users[deviceId] 
  }

  /* Return array */
  usersList() {
    return Object.keys(this.users).map((key) => {
      return this.users[key]
    })
  }

  addInfoToUser(user: User) {
    Object.keys(user).forEach( (key) => {
      this.users[user.deviceId][key] = user[key]
    })
  }

  /* Return an object with deviceId keys */
  get users() {
    return this._users
  }

  set users(val) {
    this._users = val
  }

}


export default UsersController;