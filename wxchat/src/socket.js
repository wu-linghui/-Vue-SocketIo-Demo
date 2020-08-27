import io from 'socket.io-client'
// let socket= io.connect('http://localhost:3000');
// module.exports=socket;

let socket= io.connect();
export default socket;