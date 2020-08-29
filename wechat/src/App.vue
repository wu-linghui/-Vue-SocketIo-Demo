<template>
  <div id="app">
    <h1>{{msg}}</h1>
    <div class="content">
    <chat-com :currentuser='currentuser'></chat-com>
    <userlist-com @chooseuser='tochangeuser' :userlist='userlist'></userlist-com>

    </div>
  </div>
</template>

<script>
// import HelloWorld from './components/HelloWorld.vue'
import chatCom from './components/chatcom'
import userlistCom from './components/userlistcom'

export default {
  name: 'App',
  components: {
    chatCom,userlistCom
  },
  data(){
    return {
      msg:'吴凌晖',
      userlist:[
        {
          username:'悲伤后颓废',
          headerimg:require('./assets/img/1.jpeg')
        },
          {
          username:'悲伤后打代码',
          headerimg:require('./assets/img/2.jpeg')
        },
          {
          username:'悲伤后自杀',
          headerimg:require('./assets/img/3.jpg')
        },
          {
          username:'打代码后悲伤',
          headerimg:require('./assets/img/4.jpeg')
        },
      ],
      currentuser:{
        username:'',
        headerimg:require('./assets/img/1.jpeg')
      }
    }
    },
      methods:{
        tochangeuser:function(index){
          this.currentuser=this.userlist [index]
        }
  }
}
</script>

<style scoped>
.content{
  display: flex;
  width: 800px;
  height: 700px;
  margin: 0 auto;
  border: 2px solid #ccc;
}
</style>
