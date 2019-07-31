<template>
    <h3 class="chat-apheader">
        <a v-if="back">
            <v-icon name="fanhui" cursor="pointer" color="#fff" @clickIcon="goBack"></v-icon>
        </a>
        <span v-if="title">{{title}}</span>
        <div class="icon-slot">
            <slot></slot>
        </div>
    </h3>
</template>

<script>
    export default{
        props: {
            back: {
                default: ''
            },
            title: {
                type: String,
                default: ''
            },
        },
        data() {
            return {};
        },
        methods: {
            goBack() {
                this.$store.dispatch('setTransitionName');
                if (this.back === '-1') {
                    this.$router.go(-1);
                } else {
                    this.$router.push(this.back);
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
    .chat-apheader{
        width: 100%;
        font-size: 18px;
        font-weight: 400;
        display: flex;
        justify-content: center;
        padding: 10px 15px;
        box-sizing: border-box;
        position: relative;
        height: 50px;
        
        >a:first-child{
            display: block;
            position: absolute;
            left:5px;
            top:10px;
            i{
                display: inline-block;
                width:24px;
                height: 24px;
                cursor: pointer;
                color: #323232;
            }
        }
        .icon-slot{
            position: absolute;
            right: 15px;
            top:10px;
            a{
                color: #fff;
                font-size: 14px;
            }
        }
    }
</style>