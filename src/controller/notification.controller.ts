var FCM = require('fcm-node');
var serverKey = 'AAAAzrR9y9g:APA91bGRH3oO0jYrby24Zgou-If_gmynlD4uOHuaKJ4terNeIr9pP90J7Ur4lXCs-F0Mbw2SZR5m3FCKINXvnwNq4bcJ6P5B_UkJqopfO5qB1BqAylGF86yyi8kasl_I0M865pkDCzvQ';
var fcm = new FCM(serverKey);

class NotificationController {

    _users
    
    async sendTo(token) {
        let message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
            to: token, 
            collapse_key: 'your_collapse_key',
            
            notification: {
                title: 'Title of your push notification', 
                body: 'Body of your push notification' 
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