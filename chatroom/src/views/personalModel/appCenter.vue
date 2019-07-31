<template>
    <div class="chat-appCenter">
        <chat></chat>
    </div>
</template>

<script>
    import chat from '../components/chat/vChat'
    export default{
        data() {
            return {

            }
        },
        components: {
            chat,
        }
    }
</script>

<style lang="scss" scoped>
    .chat-appCenter{
        width:100%;
        height: 100%;
        border-radius: 5px;
        // background-color: #eff1f4;
        // box-shadow: 0 0 1px 1px #d5d5d5;
        box-sizing: border-box;
        display: flex;
    }
</style>