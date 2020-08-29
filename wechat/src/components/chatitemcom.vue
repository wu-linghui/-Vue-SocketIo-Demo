<template>
    <div class='chatitem'>
        <img :src="chatitem.user.headerimg" alt="">
        <div><slot></slot></div>
    </div>
</template>

<script>
export default {
    props:['chatitem']
}
</script>

<style scoped>
    img{
        width: 60px;
        height: 60px;
        display: flex;
    }
</style>
