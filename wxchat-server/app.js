var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
//引入sql模块
var sqlQuery= require('./module/lcMysql');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);


// 在app文件里设置一个接口，axios访问放回数据库信息
app.get('/api/userlist',async function(req,res){
  let sqlStr='select * from user where isgroup is null'
  //等待获取mysql查询结果
  let result=await sqlQuery(sqlStr);
  res.append('Access-Control-Allow-Origin',"*")
  res.append('Access-Control-Allow-Content-Type',"*")
  res.json(Array.from(result))
})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


setTimeout(()=>{
  let socketio=require('./socketio')
  let io=socketio.io;
  
  io.on('connection', function (socket) {
    socket.emit('news', { hello: 'world' });
    socket.on('my other event', function (data) {
      console.log(data);
    });
  });

},100)
console.log('服务器运行成功');

module.exports = app;
