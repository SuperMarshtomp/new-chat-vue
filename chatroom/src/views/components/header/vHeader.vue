<template>
    <div class="vchat-header">
        <div class="vchat-main-header" v-if="isMainHeader">
            <div class="vchat-header-container">
                <div class="vchat-mine">
                    <div>
                        <router-link to = "/mySetting">
                            <img :src="avatar" alt="">
                        </router-link>
                    </div>
                
                    <div class="nickname" >
                        <span :title="user.nickname">{{user.nickname}}</span>
                    </div>
                </div>
                <div class = "bottom-btn">
                    <el-button @click="$router.push({name: 'mySetting'})" icon="el-icon-s-tools">设置</el-button>
                </div>
                <div class = "bottom-btn">
                    <el-button @click="loginOut" type="primary" icon="el-icon-switch-button">退出</el-button>
                </div>
            </div>
            
        </div>
        <div class="vchat-little-header" v-else>
            <div>
                <router-link to="/main/personalMain">你话我猜</router-link>
                <span class="logout" @click="$router.push({name: 'personalMain'})">[返回]</span>
            </div>
            <div class="avatar">
                <a href="javascipt:;">
                    <img :src="avatar" alt="">
                </a>
                <span @click="loginOut" class="logout">[退出]</span>
            </div>
        </div>
    </div>
</template>

<script>
    import api from '../../../api';
    import chat from '../chat/vChat';
    import VueDraggableResizable from 'vue-draggable-resizable';
    import utils from '../../../utils/utils';
    import { mapState, mapGetters } from 'vuex';
    export default{
        name: 'vHeader',
        props: {
            isMainHeader: {
                type: Boolean,
                default: true
            }
        },
        data() {
            return {
//                hover: false,
                draggable: true, // 允许拖拽
                handleList: [
                    {
                        name: '个人空间',
                        icon: 'icon-zhanghaoguanli1',
                        link: '/mine'
                    },
                    {
                        name: '日程管理',
                        icon: 'icon-huihuajilu',
                        link: '/todo'
                    },
                    {
                        name: '设置',
                        icon: 'icon-shezhi1',
                        link: '/mySetting'
                    }
                ],
                x: Number(window.localStorage.x) || 100,
                y: Number(window.localStorage.y) || 100,
                w: Number(window.localStorage.w) || 736,
                h: Number(window.localStorage.h) || 460
            };
        },
        components: {
            chat,
            VueDraggableResizable
        },
        computed: {
            avatar() {
                return process.env.VUE_APP_BACK_URL + this.$store.state.user.photo; // 用户头像avatar:
            },
            ...mapState(['user', 'conversationsList']),
            ...mapGetters(['unReadCount'])
        },
        watch: {
        },
        methods: {
            reset() {
                this.x = 100;
                this.y = 100;
                this.w = 736;
                this.h = 460;
                window.localStorage.w = 736;
                window.localStorage.h = 460;
                window.localStorage.x = 100;
                window.localStorage.y = 100;
            },
            loginOut() {
                this.$confirm('确认退出登录？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.leaveRoom();
                    api.loginOut().then(r => {
                        if (r.code === 0) {
                            this.$message.success('退出成功');
                            this.$store.commit('setUser', 'out');
                            this.$router.replace('/');
                        }
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '取消'
                    });          
                })
            },
            leaveRoom() {
                this.conversationsList.forEach(v => {
                    let val = {
                        name: this.user.name,
                        time: utils.formatTime(new Date()),
                        avatar: this.user.photo,
                        roomid: v.id
                    };
                    this.$socket.emit('leave', val);
                });
            },
        }
    }
</script>
<style lang="scss">
    .vchat-header{
        .vchat-main-header {
            width: 100%;
            height: 100%;
            .vchat-header-container{
                background: url('../../../assets/img/logo.png');
                background-size: 100%;
                // background-color: #d5d5d5;
                width: 120px;
                height: 80px;
                display: block;
                margin: auto;
                justify-content: space-between;
                align-items: center;
                position: relative;
                z-index: 2002;
            }
            .vchat-logo {
                width: 100%;
                height: 50px;
                /*color: #fff;*/
                
                font-size: 22px;
                line-height: 80px;
            }
            .vchat-mine {
                
                display: block;
                justify-content: flex-start;
                align-items: center;
                padding-top:100px;
                > div:nth-of-type(1) {
                    
                    width: 80px;
                    height: 70px;
                    padding: 5px 10px;
                    box-sizing: border-box;
                    margin:auto;
                    border-radius: 2px;
                    position: relative;
                }
                > div:nth-of-type(1) > a {
                    display: block;
                    width: 100%;
                    height: 100%;
                    overflow: hidden;
                    border-radius: 50%;
                    border: 2px solid #d5d5d5;
                    cursor: default;
                    img {
                        width: 100%;
                    }
                }
                > div:nth-of-type(1):hover {
                    background-color: #f5f5f5;
                }
                
            }
            .nickname{
                font-size: 15px;
                max-width: 115px;
                text-overflow: ellipsis;
                white-space: nowrap;
                
                padding-top: 20px;
            }
            .vdr{
                position: fixed;
                background-color: #fff;
                max-width: 1728px;
                max-height: 1080px;
                border-radius: 3px;
                .handle{
                    width: 8px;
                    height: 8px;
                    background: #f5f5f5;
                    border-radius: 2px;
                }
            }
            .bottom-btn{
                display: block;
                margin-top: 80px;
                width: 100%;
            }
        }
        .vchat-little-header{
            width:100%;
            height: 40px;
            padding: 0 30px;
            text-align: left;
            box-sizing: border-box;
            display: flex;
            justify-content: space-between;
            align-items: center;
            >div{
                a{
                    font-size: 20px;
                    line-height: 40px;
                    color: #fff;
                }
                span{
                    margin-left: 10px;
                    color: #fff;
                    font-size: 12px;
                }
            }
            .avatar{
                display: flex;
                justify-content: flex-start;
                align-items: center;
                a{
                    display: block;
                    width:32px;
                    height: 32px;
                    margin-right: 10px;
                    border-radius: 50%;
                    overflow: hidden;
                    img{
                        width:100%;
                    }
                }
            }
            span{
                cursor: pointer;
            }
        }
    }

</style>