<template>
  <div id="app">
    <chooseusercom v-if="$root.me==null" :userlist='userlist'></chooseusercom>
    <userlist v-if='islogin' :islogin="islogin" :users='users' :chooseuser='chooseuser' :unreadlist='unreadlist'></userlist>
    <!--userlist组件就是我的问题核心它原始的显示判断仅为动态：islogin=‘islogin’
    在组件为chooseusrcom和userlist时有效但在添加组件后失效显示的判断出现失效无法隐藏  -->
    <chatusercom v-if="ischat" :touser='touser' :closechat='closechat' :newsmsg='newsmsg' ></chatusercom>
  </div>
</template>

<script>

// import HelloWorld from './components/HelloWorld.vue'
import axios from 'axios'
import userlist from './components/userlistcom.vue'
import chooseusercom from './components/chooseusercom.vue'
import chatusercom from './components/chatusercom.vue'
import io from 'socket.io-client'
import socket from './socket'

export default {
  name: 'app',
  components: {
    chooseusercom,userlist,chatusercom
  },
  data(){
    return {
      userlist:[],
      islogin:false,//判断条件
      users:[],
      ischat:false,
      touser:null,
      unreadlist:[],
      newsmsg:null,
    }
  },
  //异步向socket服务器请求数据库信息
  async beforeMount(){
    let res=await axios.get('/api/userlist')
    this.userlist=res.data
     
  },
  //
  mounted(){
    // let socket=io.connect('http://localhost:3000')
    // socket.on('connect',function(){
    //   console.log('与服务器建立起socket连接'); 
    // })


    //监听登录事件，成功设置为true
    socket.on('login',(data)=>{
      if (data.state=='ok') {
        this.islogin=true;
        socket.emit('users')
      }
    })
    //监听登出事件
    socket.on('logout',(data)=>{
      console.log(data);
      this.islogin=false;
      //断开连接
      socket.disconnect()
    })
    //监听断开连接事件
    socket.on('disconnect',(data)=>{
      console.log('断开连接');
    })

    socket.on('users',(data)=>{
      console.log(data);
      this.users=data
    })

    socket.on('unreadmsg',(data)=>{
      // console.log(data);
      data.forEach((item,index)=>{
        //将from/to改成用户头像的对象
        item.from=this.usersobj[item.from]
        item.to=this.usersobj[item.to]
        //设置未读的红点
      this.unreadlist.push(item.from)
        //将聊天内容分别添加到本地的存储
        let strkey='chat-user-'+this.$root.me.username+'-'+item.from.username;
        //先解析本地存储的数据，在添加
        localStorage[strkey]=localStorage[strkey]?localStorage[strkey]:[];
        let newarr=JSON.parse(localStorage[strkey]);
        //push返回一个值覆盖了本地存储的信息
        newarr.push(item)
        localStorage[strkey]=JSON.stringify(newarr); 
      })
    })

    socket.on('accept',(msg)=>{
      // console.log('接收的数据');
      console.log(msg);
      // console.log(this.ischat);
      // console.log(this.touser);
      if( (this.ischat==true&&msg.from.username==this.touser.username)||(msg.to.username==this.touser.username&&msg.to.isgroup=='true')) {
        this.newsmsg=msg;
      }else{
        let strkey='chat-user-'+this.$root.me.username+'-'+msg.from.username;
        //先解析本地存储的数据，在添加
        localStorage[strkey]=localStorage[strkey]?localStorage[strkey]:[];
        let newarr=JSON.parse(localStorage[strkey]);
        //push返回一个值覆盖了本地存储的信息
        newarr.push(msg)
        localStorage[strkey]=JSON.stringify(newarr); 
        this.unreadlist.push(msg.from.username)
      }
    })
  },
  methods:{
    chooseuser:function(user){
      this.touser=user;
      this.ischat=true;
      this.islogin=false;//后添加的方法修改判断属性值
      let index=this.unreadlist.indexOf(user.username)
      this.unreadlist.splice(index,1);
    },
    closechat:function(){
      this.ischat=false;
      this.islogin=true; 
    }
  },
  computed:{
    usersobj:function(){
      let obj ={}
      this.users.forEach((item,index)=>{
        obj[item.username]=item;
      })
      // console.log(obj);
      return obj;
    }
  }
}
</script>

<style>
*{
  margin: 0;
  padding: 0;
}
</style>
