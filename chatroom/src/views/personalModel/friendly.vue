<template>
    <div class="chat-friendly">
        <div class="chat-friendly-container">
            <transition :name="transitonName">
                <router-view v-if="isShow"></router-view>
            </transition>
        </div>
    </div>
</template>

<script>
    export default{
        data() {
            return {
                isShow: true,
                transitonName: 'moveIn' // 过渡动画名
            }
        },
        watch: {
            '$store.state.transitionName'(name) { // 监测切换页面过渡动画
                if (name === 'moveOut') {
                    this.transitonName = 'moveOut';
                } else {
                    this.transitonName = 'moveIn';
                }
            }
        },
        beforeDestroy() { // 适应leave动画
            this.isShow = false;
        }
    }
</script>

<style lang="scss" scoped>
    .chat-friendly{
        width:100%;
        height: 100%;
        display: flex;
        justify-content: space-around;
        .chat-friendly-container{
            width: 100%;
            min-width: 300px;
            height: 100%;
            background-color: rgba(231, 231, 231, 0.925);
            overflow: hidden;
            position: relative;
        }
    }
</style>