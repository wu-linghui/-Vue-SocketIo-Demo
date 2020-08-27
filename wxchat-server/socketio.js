// const socketio = require('./js/socketio')
let socketio={}

let sqlQuery =require('./module/lcMysql');

function getsocket(server){
    socketio.io=require('socket.io')(server)
        // let socketio=require('./socketio')
        let io=socketio.io;
        
        io.on('connection', function (socket) {
            console.log(socket.id+'建立连接');
            //  接收登录事件
            socket.on('login', async function(data){
                //先判断是否有人在线，如果有人在的话，那么将其断开连接
                let sqlstr1='select * from user where isonline=? and username=?'
                let result1=await sqlQuery(sqlstr1,['true',data.username])
                if(result1.length>0){
                    socket.to(result1[0].socketid).emit('logout',{content:'有人登录，你被踢出！'})
                }


                //修改数据库登录信息（socketid，isonline）
                let sqlStr='update user set socketid = ?,isonline = ? where username = ?'
                let result =await sqlQuery(sqlStr,[socket.id,'true',data.username])
                socket.emit('login',{
                    state:'ok',
                    content:'登陆成功'
                })
                let sqlstr2='select * from user'
                //等待获取mysql查询结果
                let result2=await sqlQuery(sqlstr2)
                io.sockets.emit('users',Array.from(result2))

                //最新未接收的消息
                let sqlstr3 ='select * from chat where isread=? and `to`=?'
                let result3 =await sqlQuery(sqlstr3,['false',data.username])
                socket.emit('unreadmsg',Array.from(result3))


                //加入群聊房间
                //获取群列表
                let sqlstr4='select * from user where isgroup=?';
                let result4=await sqlQuery(sqlstr4,['true'])
                Array.from(result4).forEach((item,index)=>{
                    socket.join(item.socketid)
                })
            })

            socket.on('disconnect',async function(){
                //修改数据库登录信息(socketid,isonline)
                let sqlStr='update user set socketid=?, isonline=? where socketid=?'
                let result=await sqlQuery(sqlStr,[null,null,socket.id])
            })

            socket.on('users',async function(){
                let sqlstr='select * from user'
                //等待获取mysql的查询结果
                let result=await sqlQuery(sqlstr)
                socket.emit('users',Array.from(result))
            })
            socket.on('sendmsg',async function(msg) {
                // console.log(msg);
                //判断收消息的人是否在线
                let strsql='select * from user where username=? and isonline=?'
                let result = await sqlQuery(strsql,[msg.to.username,'true'])
                if (result.length>0) {
                    //在线时直接发过去
                    let toid=result[0].socketid;
                    console.log(toid);
                    socket.to(toid).emit('accept',msg)
                    //不在线时将聊天记录存在数据库
                    let strsql1='insert into chat (`from`,`to`,content,`time`,isread) values (?, ?, ?, ?,?)'
                    let arr1=[msg.from.username,msg.to.username,msg.content,msg.time,'true']
                    sqlQuery(strsql1,arr1)
                }else{
                    let strsql1='insert into chat (`from`,`to`,content,`time`,isread) values (?, ?, ?, ?,?)'
                    let arr1=[msg.from.username,msg.to.username,msg.content,msg.time,'false']
                    sqlQuery(strsql1,arr1)
                }
            })
            //如果收到已读信息，将已读信息改为true
            socket.on('readmsg',(data) => {
                let sqlstr ='update chat set isread=? where `from`=? and `to`=?';
                sqlQuery(sqlstr,['true',data.username,data.self])
            })

        });

}
socketio.getsocket=getsocket;
module.exports=socketio