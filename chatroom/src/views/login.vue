<template>
    <div class="chat-login" v-bgInmage="bg">
        <div class="logo">
            <h3 class="title">你话我猜</h3>
        </div>
        <div class="sign">
            <div class="title">
                <span :class="{active: islogin}" @click="choose(true)">登录</span>
                <span :class="{active: !islogin}" @click="choose(false)">注册</span>
            </div>
            <el-form ref="signForm" label-width="80px" class="signForm" :rules="signRules" :model="signForm">
                <el-form-item prop="name">
                    <el-input v-model="signForm.name" placeholder="账号">
                        <i class="iconfont icon-zhanghao" slot="prepend"></i>
                    </el-input>
                </el-form-item>

                <el-form-item prop="pass">
                    <el-input v-model="signForm.pass" placeholder="密码" type="password" @keyup.enter.native="enter(islogin)">
                        <i class="iconfont icon-mima3" slot="prepend"></i>
                    </el-input>
                </el-form-item>

                <el-form-item prop="repass" v-if="!islogin">
                    <el-input v-model="signForm.repass" placeholder="确认密码" type="password" @keyup.enter.native="enter(islogin)">
                        <i class="iconfont icon-mima2" slot="prepend"></i>
                    </el-input>
                </el-form-item>

            </el-form>
            <button @click="enter(islogin)">
                <v-icon class="el-icon-loading" color="#fff" :size="15" v-if="loading"></v-icon>
                {{islogin ? '登录' : '注册'}}
            </button>
        </div>
    </div>
</template>

<script>
    import api from '../api';
    // import Canvas from 'vchat-regcode';
    import bg from '../assets/img/background2.jpg';
    export default {
        name: 'login',
        data() {
            let validateName = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入账号'));
                } else {
                    let reg = /^[a-zA-Z0-9_]{2,8}$/;
                    if (!reg.test(value)) {
                        callback(new Error('请输入2~8位数字字母下划线'));
                        return;
                    }
                    callback();
                }
            };
            let validatePass = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入密码'));
                } else {
                    let reg = /^[a-zA-Z0-9]{6,12}$/;
                    if (!reg.test(value)) {
                        callback(new Error('请输入6~12位数字字母组合'));
                        return;
                    }
                    callback();
                }
            };
            let validateRePass = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入确认密码'));
                } else {
                    if (value !== this.signForm.pass) {
                        callback(new Error('两次密码输入不一致'));
                        return;
                    }
                    callback();
                }
            };
            return {
                signForm: {
                    name: '',
                    pass: '',
                    // regcode: '',
                    repass: ''
                },
                bg: bg,
                IMGURL: '',
                islogin: true, // 登录 or 注册
                showSign: true, // 登录框显示
                signRules: {
                    name: [
                        { validator: validateName, trigger: 'blur' }
                    ],
                    pass: [
                        { validator: validatePass, trigger: 'blur' }
                    ],
                    repass: [
                        { validator: validateRePass, trigger: 'blur' }
                    ],
                },
                signSuccess: { // 注册成功提示框
                    code: '',
                    Visible: false
                },
                loading: false
            }
        },
        watch: {
        },
        methods: {
            choose(flag) {
                this.$refs['signForm'].resetFields();
                this.islogin = flag;
            },
            enter(f) {
                this.$refs['signForm'].validate((valid) => {
                    if (valid) {
                        if (f) {
                            this.login();
                        } else {
                            this.signUp();
                        }
                    } else {
                        return false;
                    }
                });
            },
            login() {
                let params = {
                    name: this.signForm.name,
                    pass: this.signForm.pass
                };
                this.loading = true;
                api.login(params).then(r => {
                    if (r.code === 0) {
                        this.$message.success('登录成功');
                        this.$store.dispatch('getUserInfo', this);
                    } else if (r.code === -1) {
                        this.$message.error('账号不存在或密码错误');
                        this.loading = false;
                    } else {
                        this.$message.error('登录失败');
                        this.loading = false;
                    }
                });
            },
            signUp() {
                let params = {
                    name: this.signForm.name,
                    pass: this.signForm.pass
                };
                this.loading = true;
                api.signUp(params).then(r => {
                    if (r.code === 0) {
                        this.$refs['signForm'].resetFields();
                        this.$notify({
                            title: '注册成功',
                            message: `您的账号为：${r.data}，可以使用账号登录！`,
                            duration: 5000,
                            type: 'success'
                        });
                        this.islogin = true;
                    } else if (r.code === 1) {
                        this.$message.error('账号已存在')
                    } else {
                        this.$message.error('注册失败')
                    }
                    this.loading = false;
                });
            },
            handelClose(done) {
                this.islogin = true;
                done();
            }
        },
        mounted() {
        }
    }
</script>

<style scoped lang="scss">
    .chat-login{
        width:100%;
        height: 100%;
        overflow: hidden;
        position: relative;
        background: #5c524f;
        
    }
    
    .logo{
        margin-top: 15%;
        transform: translateY(-180%);
        transition: transform 0.5s;
        h3.title{
            font-size: 38px;
            color: #fff;
            text-align: center;
            font-weight: 400;
            margin-bottom: 20px;
        }
        span.begain{
            color: #fff;
            font-size: 20px;
            animation: fide 2s infinite;
            cursor: pointer;
        }
        span.begain:hover{
            opacity: 1;
            animation-play-state:paused;
            -webkit-animation-play-state:paused;
        }
        @keyframes fide {
            0% {
                opacity: 1;
            }
            50% {
                opacity: 0.3;
            }
            100% {
                opacity: 1;
            }
        }
    }
    // .logo.active{
    //     transform: translateY(-100%);
    // }
    .sign{
        width: 350px;
        // height: 370px;
        padding: 15px 25px 25px;
        background-color: #fff;
        border-radius: 10px;
        box-sizing: border-box;
        position: absolute;
        left:50%;
        top:50%;
        margin-left: -175px;
        margin-top: -175px;
        animation: move 1.2s;
        box-shadow: 0 0 10px 5px rgba(255, 255, 255, 0.39);
    }
    @keyframes move {
        0% {
            left: 0
        }
        40% {
            left: 50%;
        }
        40%, 100% {
            -webkit-transform: translate(0, 0);
        }
        // 50%,
        // 70%,
        // 90% {
        //     -webkit-transform: translate(-5px, -5px);
        // }
        // 60%,
        // 80% {
        //     -webkit-transform: translate(5px, 5px);
        // }
    }
    .sign .title{
        display: flex;
        justify-content: center;
        margin-bottom: 30px;
    }
    .sign .title span{
        width:100px;
        border-right: 1px solid #d5d5d5;
        cursor: pointer;
    }
    .sign .title span:nth-of-type(2){
        border-right: none;
    }
    .sign .title span.active{
        color: #c20c0c;
    }
    .sign button{
        width:80%;
        border: none;
        outline: none;
        height: 36px;
        background-color: #c20c0c;
        color: #fff;
        border-radius: 25px;
        cursor: pointer;
        margin-top: 20px;
        margin-bottom: 10px;
    }
    .sign button:hover{
        background-color: #df3b3b;
        color: #fff;
    }
    .login-foot{
        width:100%;
        font-size: 12px;
        height: 24px;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #d5d5d5;
    }
    .login-foot span{
        width:100px;
        height: 1px;
        background-color: #d5d5d5;
        display: inline-block;
        margin: 0 10px;
    }
    .regcode-box{
        .el-input{
            width:205px;
        }
        canvas{
            display: inline-block;
            vertical-align: middle;
        }
    }
</style>
