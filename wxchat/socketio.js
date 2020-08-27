const sqlQuery = require('../chatapp/module/lcMysql');

// const socketio = require('./js/socketio')
let socketio={}

// require('../')

function getsocket(server){
    socketio.io=require('socket.io')(server)
        // let socketio=require('./socketio')
        let io=socketio.io;
        
        io.on('connection', function (socket) {
            console.log(socket.id+'建立连接');

            // //接收登录事件
            // socket.on('login',function(daat){
            //     let sqlStr='updata user set socketid=?,isonline=?where username=?'
            //     let result =await sqlQuery
            // })
        })

}
socketio.getsocket=getsocket;
module.exports=socketio