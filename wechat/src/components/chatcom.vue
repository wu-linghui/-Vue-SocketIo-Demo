<template>
    <div class="chat">
        <h1 class='user'>用户:{{currentuser.username}}</h1>
        <!-- 聊天列表 -->
        <div class="chatlist">
            <chatitem-com v-for="(item,index) in chatlist" :chatitem='item' :key="index">
                {{item.chatcontent}}
            </chatitem-com>
        </div>
        <chatinput-com :sendevent='sendevent'></chatinput-com>
    </div>
</template>

<script>
import chatinputCom from './chatinputcom'
import chatitemCom from './chatitemcom'
export default {
    props:['currentuser'],
    components:{chatinputCom,chatitemCom},
    data(){
        return{
            chatlist:[
                {
                    user:{
                        username:'悲伤后颓废',
                        headerimg:require('../assets/img/1.jpeg')
                        },
                        chatcontent:'我是你爹!'
                        }
            ]
        }
    },
    methods:{
        sendevent:function(value){
            this.chatlist.push({
                user:{
                    username:'悲伤后打代码',
                    headerimg:require('../assets/img/2.jpeg')
                },
                chatcontent:value
            })
            console.log(this);
            this.chatlist.push({
                user:this.$root.$children[0].currentuser,
                chatcontent:new Date()
            })
        }
    }
}
</script>
<style  scoped>
.chat{
        width :500px;
        height :700px;
        border: 1px solid #ccc;
}
</style>