<template>
    <div class="chatusercom">
        <div class="header">
            <span class="back" @click="closechat">&lt;</span>
            <div>{{touser.username}}</div>
        </div>
        <div class="chatlist" ref='chatbox'>
            <div class="chatitem" v-for="(item,index) in chatlist" :key="index"
                :class="{self:$root.me.username==item.from.username}">
                <div class="header">
                    <img :src="item.from.headerimg" alt="">
                </div>
                <div class="chatcontent">
                    {{item.content}}
                </div>
            </div>
        </div>
        <div class="inputcom">
            <input type="text" v-model="inputdata" @keydown.enter='sendevent'>
            <button @click="sendevent">发送</button>
        </div>
    </div>
</template>
<script>
    import socket from '../socket'
    export default {
        props: ['touser', 'closechat','newsmsg'],
        data() {
            return {
                chatlist: [],
                inputdata: '',
                // item:'',
            }
        },
        methods: {
            sendevent: function () {
                let msg = {
                    from: this.$root.me,
                    to: this.touser,
                    content: this.inputdata,
                    time: new Date().getTime()
                }
                //发送到服务端
                socket.emit('sendmsg', msg)
                this.chatlist.push(msg)
                //保存聊天数据到本地
                this.saveStorage()
                // this.tobuttom()
            },
            //保存数据的函数
            saveStorage() {
                let strKey = 'chat-user-' + this.$root.me.username + '-' + this.touser.username;
                localStorage[strKey] = JSON.stringify(this.chatlist);
            },
            getStorage() {
                let strKey = 'chat-user-' + this.$root.me.username + '-' + this.touser.username;
                localStorage[strKey] = localStorage[strKey] ? localStorage[strKey] : '[]';
                this.chatlist = JSON.parse(localStorage[strKey]);
            },
            tobuttom(){
                let chatbox=this.$refs.chatbox;
                chatbox.scrollTop=chatbox.scrollHeight-chatbox.clientHeight;
            }
        },
        beforeMount() {
            this.getStorage()
            socket.emit('readmsg', {
                self: this.$root.me.username,
                username: this.touser.username,
            })
        },
        mounted(){
           this.tobuttom()
        },
        watch: {
            newsmsg: function(val){
                this.chatlist.push(val);
                this.saveStorage()
            }
        },
        //生命周期影响tobuttom在数据更新前有延迟
        updated(){
            this.tobuttom()
        }

    }
</script>

<style scoped>
    .chatitem {
        display: flex;
        height: 40px;
        margin: 5px 10px;
    }

    .chatitem.self {
        flex-direction: row-reverse;
        justify-content: flex-start;
    }

    .chatitem .header img {
        width: 40px;
        height: 40px;
        border-radius: 50%;

    }

    .chatitem .chatcontent {
        background: #bbb;
        border-radius: 5px;
        padding: 5px;
        color: #fff;
        margin: 0 0px 0 10px;
        line-height: 30px;
        position: relative;
    }

    .chatitem.self .chatcontent {
        margin: 0 10px 0px 0px;
    }

    .chatitem .chatcontent::before {
        display: block;
        content: "";
        position: absolute;
        width: 0;
        height: 0;
        border-right: 8px solid #bbb;
        border-top: 8px solid transparent;
        border-bottom: 8px solid transparent;
        top: 12px;
        left: -7px;
    }

    .chatitem.self .chatcontent::before {
        display: block;
        content: "";
        position: absolute;
        width: 0;
        height: 0;
        border-left: 8px solid #bbb;
        border-top: 8px solid transparent;
        border-bottom: 8px solid transparent;
        top: 12px;
        right: -7px;
        left: initial;
        border-right: initial;
    }

    .chatusercom {
        width: 100vw;
        height: 100vh;
        display: flex;
        flex-direction: column;
        position: fixed;
        top: 0;
        left: 0;
        background: #efefef;
    }

    .chatusercom .back {
        display: block;
        width: 40px;
        height: 40px;
        line-height: 40px;
        text-align: center;
        position: absolute;
        left: 0;
        top: 0;
    }

    .chatusercom>.header {
        font-size: 18px;
        font-weight: 900;
        background: skyblue;
        height: 40px;
        text-align: center;
        line-height: 40px;
        position: relative;
    }

    .chatlist {
        flex: 1;
        overflow:scroll;
    }

    .inputcom {
        height: 50px;
        display: flex;
        background: #eee;
        justify-content: space-between;

    }

    .inputcom input {
        width: 270px;
        height: 40px;
        border-radius: 5px;
        outline: none;
        border: 1px solid #ccc;
        margin: 0 5px;
    }

    .inputcom button {
        width: 80px;
        height: 40px;
        border-radius: 5px;
        outline: none;
        border: 1px solid #ccc;
        margin: 0 5px;
    }
</style>