<template>
<!-- 一个组件只能有一个div -->
    <div class="chooseusercom">
        <h1>请选择你的聊天角色</h1>
        <div class="list">
        <div class="item" @click="chooseevent(item)" v-for="(item,index) in userlist" :key='index'>
            <img :src="item.headerimg" alt="">
            <span>{{item.username}}</span>
        </div>
        </div>
    </div>
</template>


<script>
import socket from '../socket';
export default {
    props:['userlist'],
    methods:{
        chooseevent:function(user){
            this.$root.me=user;
            localStorage.chatme=JSON.stringify(user);
            socket.emit('login',user)
        }
        }
}
</script>

<style scoped>
.chooseusercom{
    width: 100vw;
    height: 100vh;
    background: skyblue;
}
.chooseusercom h1{
    font-size: 20px;
    text-align: center;
    padding: 20px 0;
}
.list{
    display: flex;
    flex-wrap: wrap;
    /* margin: 20px ; */
}
.item{
    /* flex: 1; */

    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    width: 50%;
    height: 130px;
}
.item img{
    width: 70px;
    height: 70px;
    border-radius:35px;
    /* padding: 20px 0; */
}
.item span{
    padding: 5px 0;
}
</style>