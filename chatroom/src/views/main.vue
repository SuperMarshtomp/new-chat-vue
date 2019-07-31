<template>
    <div class="chat-main">
        <v-header></v-header>
        <div class="chat-content">
            <div class="chat-content-sub">
                <router-view/>
            </div>
        </div>
    </div>
</template>

<script>
    import utils from '../utils/utils';
    import { mapState } from 'vuex';
    import vHeader from './components/header/vHeader';
    export default{
        data() {
            return {
            };
        },
        watch: {
            conversationsList: {
                handler() {
                    this.joinRoom();
                },
                deep: true,
                immediate: true
            }
        },
        computed: {
            ...mapState(['user', 'conversationsList', 'Vchat'])
        },
        components: {
            vHeader
        },
        sockets:{
            connect: function (val) {
                console.log(this.$socket.id);
                console.log('连接成功');
            },
            customEmit: function (val) {
                console.log('连接失败');
            },
            joined(OnlineUser) {
                console.log('加入了', OnlineUser);
                this.$store.commit('setOnlineUser', OnlineUser)
            },
            leaved(OnlineUser) {
                this.$store.commit('setOnlineUser', OnlineUser)
            },
            getHistoryMessages(mesdata) { // 获取未读消息数量
                let data = mesdata.filter(v => v.read.indexOf(this.user.name) === -1);
                if (data.length) {
                    this.$store.commit('setUnRead', {roomid: data[0].roomid, count: data.length});
                }
            },
            mes(r) { //更改未读消息数量
                this.$store.commit('setUnRead', {roomid: r.roomid, add: true, count: 1});
            },
            takeValidate(r) {
                this.$store.commit('setUnRead', {roomid: r.roomid, add: true, count: 1});
                if (r.type === 'info') {
                    this.$store.dispatch('getUserInfo');
                }
            }
        },
        methods: {
            joinRoom() {
                if (!this.user.name) {
                    return ;
                }
                this.conversationsList.forEach(v => {
                    let val = {
                        name: this.user.name,
                        time: utils.formatTime(new Date()),
                        avatar: this.user.photo,
                        roomid: v.id
                    };
                    let room = {roomid: v.id, offset: 1, limit: 200};
                    this.$socket.emit('join', val);
                    this.$socket.emit('getHistoryMessages', room);
                });
            }
        },
        mounted() {
        }
    }
</script>

<style lang="scss" scoped>
.chat-main{
    width: 100%;
    height: 100%;
    display: flex;
    .chat-content-nav {
        width: 120px;
        height: 100%;
        ul {
            width: 100%;
            li {
                padding: 15px 0;
                cursor: pointer;
                a {
                    display: block;
                    text-decoration: none;
                    i {
                        font-size: 32px;
                        margin-bottom: 5px;
                    }
                    p {
                        font-size: 12px;
                    }
                }
            }
        }
    }
    .chat-content {
        width: 100%;
        // height: calc(100% - 80px);
        height: 100%;
        min-height: 600px;
        display: flex;
        justify-content: flex-start;
        background-color: #fff;
        background: url("../assets/img/logo.png");
        .chat-content-sub{
            width: calc(100% - 120px);
            height: 100%;
            min-width: 1170px;
        }
    }
}
</style>