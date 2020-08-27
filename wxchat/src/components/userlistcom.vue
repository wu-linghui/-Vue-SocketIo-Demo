<template>
    <div class="userlist">
        <div class="nav">
            <div class="headerimg" :class="{online:islogin}">
                <img v-if="$root.me!=null" :src="$root.me.headerimg" alt="">
            </div>
            <div class='title'>消 息</div>
            <div class="headerimg"></div>
        </div>
        <div class="users">
            <div @click="chooseuser(item)" class="useritem" v-for="(item,index) in firents" :key='index'>  
                <div class="left" :class="{online:item.isonline=='true',unread:unreadlist.indexOf(item.username)!=-1}">
                <img :src="item.headerimg" alt="">
                </div>
                <div class="right">
                <span class='username'>{{item.username}}</span>
                <div class="msg"></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props:['islogin','users','chooseuser','unreadlist'],
    computed:{
        firents:function(){
            if (this.$root.me==null) {
                return[]
            }else{
                let username=this.$root.me.username;
                return this.users.filter((item,index)=>{
                    return item.username!=username
                })
            }
        }
    },
}
</script>

<style scoped>
.unread{
    position: relative;
    /* background:red; */
}
.unread::before{
    position: absolute;
    content: '';
    display: block;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background:red;
    bottom: 5px;
    right: 5px;
    z-index: 100;
}
.useritem{
    display: flex;
    height: 80px;
    background: #efefef;;
    border-bottom: 1px solid #ccc;
    align-items: center;
    padding: 0 10px;
}
.useritem .left{
    filter: grayscale(1);
}
.useritem .right{
    padding: 0 10px;
}
.useritem .left img{
    width: 50px;
    height: 50px;
    border-radius: 50%;
    /* margin: 0 10px; */

}
.username{
        margin: 0 10px;
}
    .headerimg{
         height: 50px;
        width: 50px;
        filter: grayscale(1);
        margin: 0 10px;
    }
    .online{
        filter:grayscale(0)!important;
    }
    .nav{
        height: 80px;
        width: 100vw;
        background: skyblue;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    .nav .title{
        font-weight: 900;
        font-size: 18px;
    }
    .headerimg img{
        height: 50px;
        width: 50px;
        border-radius:50% ;
        /* margin: 15px 15px; */
    }
</style>