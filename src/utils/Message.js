import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';
import {Keyboard} from 'react-native';
class HandleMessages {
  send = (messages) => {
    Keyboard.dismiss();
    messages.forEach(({text, user}) => {
      const message = {
        text,
        user,
        timeStamp: database.ServerValue.TIMESTAMP,
      };
      this.db.push(message);
    });
  };
  get db() {
    return database().ref('messages');
  }
  parse = (message) => {
    const {text, user, timeStamp} = message.val();
    const {key: _id} = message;
    const createdAt = new Date(timeStamp);
    return {
      text,
      _id,
      createdAt,
      user,
    };
  };

  get = (callback) => {
    this.db.on('child_added', (snapshot) => callback(this.parse(snapshot)));
  };
  off = () => {
    this.db.off();
  };
  get uid() {
    return (auth().currentUser || {}).uid;
  }
}
export default new HandleMessages();
