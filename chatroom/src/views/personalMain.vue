<template>
    <div class="chat-personalMain">
        <div class="chat-content-left-view">
            <div class="chat-content-left-box">
                <div class="chat-content-left-content">
                    <router-view></router-view>
                </div>
                <div class="chat-content-left-footer">
                    <ul>
                        <li v-for="v in nav" :key="v.id" :class="{active: $route.path.indexOf(v.link) > -1}">
                            <router-link :to="{path: v.link}">
                                <i class="iconfont" :class="[$route.path.indexOf(v.link) === -1 ? v.class : v.activeClass]"></i>
                                <p>{{v.name}}</p>
                            </router-link>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <div class="chat-content-right-view">
            <app-center></app-center>
        </div>
    </div>
</template>
<script>
    import appCenter from './personalModel/appCenter.vue';
    export default{
        name: '',
        data() {
            return {
                nav: [
                    {
                        name: '好友',
                        class: 'icon-people',
                        activeClass: 'icon-people_fill',
                        id: 2,
                        link: '/main/personalMain/friendly'
                    },
                    {
                        name: '群聊',
                        class: 'icon-group',
                        activeClass: 'icon-group_fill',
                        id: 3,
                        link: '/main/personalMain/group'
                    }
                ]
            }
        },
        components: {
            appCenter
        },
        methods: {
        },
        mounted() {
        }
    }
</script>
<style scoped lang="scss">
    .chat-personalMain {
        // width: calc(100% - 30px);
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: flex-start;
        padding-left:20px; 
    }
    .chat-content-left-view {
        max-width: 320px;
        height: 100%;
        padding: 20px 0 30px;
        box-sizing: border-box;
        margin-left: 20px;
        min-width: 300px;
        border-radius: 10px;
        
        .chat-content-left-box{
            // width:100%;
            // height: 100%;
            // box-sizing: border-box;
            // background-color: #fff;
            width:100%;
            height: 100%;
            border-radius: 10px;
            overflow: hidden;
            position: relative;
            box-shadow: 0 0 10px 8px #d5d5d5;
        }
        .chat-content-left-content{
            width:100%; 
            height: calc(100% - 50px);
            box-sizing: border-box;
        }
        .chat-content-left-footer{
            width:100%;
            height: 50px;
            box-sizing: border-box;
            background-color: rgba(245, 245, 245, 0.541);
            border-top: 1px solid #9b9b9b;
            ul{
                height: 100%;
                display: flex;
                justify-content: center;
                align-items: center;
                li{
                    width:33.3%;
                    font-size: 12px;
                    i{
                        font-size: 22px;
                    }
                }
            }
        }
    }
    .chat-content-right-view{
        width: calc(100% - 340px);
        padding: 20px 0 30px;
        min-width: 820px;
        height: 100%;
        background-color: #fff;
        box-sizing: border-box;
        margin-left: 30px;
    }
</style>