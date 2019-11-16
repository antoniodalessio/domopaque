var FCM = require('fcm-node');
var fcm = new FCM(process.env.FCM_SERVER_KEY);

class NotificationController {

    _users
    
    async sendTo(token, title, body) {
        let message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
            to: token, 
            collapse_key: 'your_collapse_key',
            
            notification: {
                title: title, 
                body: body 
            },
            
            data: {  //you can send only notification or only data(or include both)
                my_key: 'my value',
                my_another_key: 'my another value'
            }
        };
        
        await fcm.send(message, function(err, response){
            if (err) {
                console.log("Something has gone wrong!");
            } else {
                console.log("Successfully sent with response: ", response);
            }
        });
    }

    removeDuplicates(myArr, prop) {
        return myArr.filter((obj, pos, arr) => {
            return arr.map(mapObj => mapObj[prop]).indexOf(obj[prop]) === pos;
        });
    }

    get users() {
        return this.removeDuplicates(this._users, 'deviceId' )
    }

    set users(users) {
        this._users = users
    }
}

export default NotificationController;