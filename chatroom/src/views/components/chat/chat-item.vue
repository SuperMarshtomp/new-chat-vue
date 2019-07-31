<template>
    <div class="vchat-item">
        <div class="vchat-item-header">
            <span :class="{active: currNav === v.id}" v-for="(v, i) in navList" :key="i" @click="setCurrNav(v.id)" v-if="v.type.indexOf(currSation.type) > -1">{{v.name}}</span>
        </div>
        <div class="vchat-item-container" v-show="currNav === 0">
            <div class="container-chat">
                <div class="chat-room"
                     v-loading="chatLoading"
                     element-loading-text="拼命加载中"
                     element-loading-spinner="el-icon-loading"
                     element-loading-background="rgba(0, 0, 0, 0.8)"
                >
                    <v-message :chatList="chatList" @lookPhoto="lookPhoto" @chatLoading="chatLoading = false"></v-message>
                </div>
                <span style = "display:flex">
                <div class="chat-send">
                    <div class="tool">
                        <span class="tool-item" v-watchMouse="showEmoji">
                            <v-icon name="biaoqing1" :color="user.chatColor" @clickIcon="showEmoji.f = !showEmoji.f" cursor="pointer" title="发送表情"></v-icon>
                            <el-collapse-transition>
                                <div class="emoji-container" v-show="showEmoji.f">
                                    <emoji @chooseEmoji="chooseEmoji" @chooseEmojiDefault="chooseEmojiDefault"></emoji>
                                </div>
                            </el-collapse-transition>
                        </span>
                        <span class="tool-item">
                            <v-icon name="tupian2" :color="user.chatColor"></v-icon>
                            <input type="file" title="选择图片" @change="InmageChange" ref="chooseInmage" accept="image/png, image/jpeg, image/gif, image/jpg">
                        </span>
                        <span class="tool-item" >
                            <v-upload-popover :visible="uplaodVisible.f" @handleSuccess="uploadFileSuccess" v-watchMouse="uplaodVisible">
                                <v-icon name="wenjian2" :color="user.chatColor" @clickIcon="uplaodVisible.f = !uplaodVisible.f" title="选择文件"></v-icon>
                            </v-upload-popover>
                        </span>
                    </div>
                    <textarea v-model="message" @keyup.enter="send(false)" v-fontColor="'#160e0e'" placeholder="聊天"></textarea>
                    <div class="enter">
                        <el-button size="small" type= "primary" @click="send(false)">发送</el-button>
                    </div>
                </div>
                <!-- 答题游戏框 -->
                <div class="chat-send" v-if= "counting && currSation.type === 'group'">
                    <div class="tool">
                        <span class="tool-item">
                            <v-icon name="tupian2" :color="user.chatColor"></v-icon>
                            <input type="file" title="选择图片" @change="InmageChange(true)" ref="chooseInmage" accept="image/png, image/jpeg, image/gif, image/jpg">
                        </span>
                        <span class="tool-item" >
                            <v-upload-popover :visible="uplaodVisible.f" @handleSuccess="uploadFileSuccess" v-watchMouse="uplaodVisible">
                                <v-icon name="wenjian2" :color="user.chatColor" @clickIcon="uplaodVisible.f = !uplaodVisible.f" title="选择文件"></v-icon>
                            </v-upload-popover>
                        </span>
                    </div>
                    <textarea v-model="message_game" @keyup.enter="send(false,'mess',true)" v-fontColor="'#160e0e'" placeholder="游戏"></textarea>
                    <div class="enter">
                        <button class="vchat-button-mini" @click="send(false,'mess',true)">发送</button>
                    </div>
                </div>
                </span>
            </div>
            <div class="container-handel" v-if="currSation.type === 'group'">
                <div class="handel-notice">
                    <img v-lazy="IMG_URL+'/img/logo.png'"/>
                    <!-- <h3>你话我猜</h3> -->
                    <p>
                    <el-button type = "primary" :disabled="counting" @click="handleStart" v-if= "holderId==user.id">
                        <vue-countdown v-if= "counting" :time="counttime" @end = "handleCountdownEnd">
                            <template slot-scope="props">还剩 {{ props.totalSeconds }} 秒</template>
                        </vue-countdown>
                        <span v-else>开始游戏</span>
                    </el-button>
                    </p>
                    <p>
                    <vue-countdown style="font-size:40px;color:blue;text-align: center;" v-if= "counting" :time="counttime" @end = "handleCountdownEnd">
                        <template slot-scope="props">{{ props.hours }}:{{ props.minutes }}:{{ props.seconds }}</template>
                    </vue-countdown>
                    </p>
                    <p>分数：<span style="color:green;font-size:25px">{{result}}</span></p>
                    <p>已回答 <span style="color:red;font-size:25px">{{haveAns}}</span> 次</p>
                    <p>已提示 <span style="color:darkorange;font-size:25px">{{haveQue}}</span> 次</p>
                </div>
                <div class="handel-member">
                    <h3>
                        <span>群成员 ( {{onlineNum}}/{{groupUsers.length}} )</span>
                        <!-- <v-icon class="el-icon-search" :color="user.chatColor" :size="18" @clickIcon="spreadInput"></v-icon> -->
                    </h3>
                    <!-- <input type="text" v-show="spread" ref="searchMember"> -->
                    <ul>
                        <li v-for="v in groupUserList" :key="v.userId['_id']">
                            <el-avatar size="small" :src="IMG_URL + v.userId.photo"></el-avatar>
                            <span class="vchat-line1">{{v.userId.nickname}}</span>
                        </li>
                        <li>
                            <p class="loadmore" v-if="groupUsers.length > groupUserList.length" @click="loadmore">
                                <v-icon class="el-icon-loading" color="#fff" :size="14" v-if="loadmoreLoading"></v-icon>
                                加载更多</p>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <div class="vchat-item-container" v-show="currNav === 2">
            <message-log :currSation="currSation" :currNav="currNav" @lookPhoto="lookPhoto"></message-log>
        </div>
        <v-photo-swipe :visible="photoSwipeFlag" @close="photoSwipeFlag = false" :url="photoSwipeUrl"></v-photo-swipe>
        <el-dialog title="游戏设置" :visible.sync="dialogFormVisible" :append-to-body="true">
            <el-form :model="form" :rules="rules" ref="form">
                <el-form-item label="答案" prop='answer'>
                <el-input v-model="form.answer" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="时间" prop='counttime'>
                <el-time-picker
                    v-model="form.counttime"
                    :picker-options="{
                    selectableRange: '00:00:00 - 23:59:59'
                    }"
                    placeholder="任意时间点">
                </el-time-picker>
                </el-form-item>
                <el-form-item label="答题人" prop='respondent'>
                    <span v-for="v in groupUserList" :key="v.userId['_id']" style="padding-left:10px">
                    <el-checkbox style="height:50px" v-model="form.respondent"   :label="v.userId['_id']" border v-if="v.userId['_id']==holderId" disabled>
                        <el-avatar size="small" :src="IMG_URL + v.userId.photo"></el-avatar>
                        <span class="vchat-line1">{{v.userId.nickname}}</span>
                    </el-checkbox>
                    <el-checkbox style="height:50px" v-model="form.respondent" :label="v.userId['_id']" border v-else>
                        <el-avatar size="small" :src="IMG_URL + v.userId.photo"></el-avatar>
                        <span class="vchat-line1">{{v.userId.nickname}}</span>
                    </el-checkbox>
                    </span>
                </el-form-item>
                <el-form-item label="出题人">
                    <span v-for="v in groupUserList" :key="v.userId['_id']" style="padding-left:10px">
                    <el-checkbox style="height:50px" v-model="form.author"   :label="v.userId['_id']" border v-if="v.userId['_id']==holderId" disabled>
                        <el-avatar size="small" :src="IMG_URL + v.userId.photo"></el-avatar>
                        <span class="vchat-line1">{{v.userId.nickname}}</span>
                    </el-checkbox>
                    <el-checkbox style="height:50px" v-model="form.author"  :label="v.userId['_id']" border  v-else>
                        <el-avatar size="small" :src="IMG_URL + v.userId.photo"></el-avatar>
                        <span class="vchat-line1">{{v.userId.nickname}}</span>
                    </el-checkbox>
                    </span>
                </el-form-item>
                <el-form-item>
                    <el-button @click="dialogFormVisible = false">取 消</el-button>
                    <el-button type="primary" @click="startgame('form')">确 定</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
    import { mapState } from 'vuex';
    import api from '../../../api';
    import utils from '../../../utils/utils';
    import emoji from './emoji.vue';
    import vMessage from './message.vue';
    import messageLog from './messageLog.vue';
    import VueCountdown from '@chenfengyuan/vue-countdown';
    export default{
        name: 'chatItem',
        props: ['currSation'],
        data() {
            return {
                // type 0 共有 1 群聊 2 好友
                navList: [{name: '聊天', type: 'group,friend', id: 0},{name: '聊天记录', type: 'group,friend', id: 2}],
                IMG_URL: process.env.VUE_APP_BACK_URL,
                currNav: 0,
                spread: false,
                chatList: [],
                message: '',
                message_game: '',
                showEmoji: {
                    f: false
                },
                groupUsers: [], // 群成员
                uplaodVisible: {  // 上传
                    f: false
                },
                photoSwipeFlag: false, //图片放大器
                photoSwipeUrl: '',
                onlineNum: 0, // 在线人数
                chatLoading: false,
                loadmoreLoading: false,
                groupUserList: [], // 长列表渲染
                offset: 1, // 群成员页码
                limit: 50,
                counting:false,
                dialogFormVisible:false,
                holderId:'',
                counttime:0,
                isRes:false,
                isAut:false,
                answer:'',
                haveAns:0,
                haveQue:0,
                result:0,
                form:{
                    answer:'',
                    counttime:new Date(),
                    respondent:[],
                    author:[]
                },
                rules:{
                    answer:[
                        { required: true, message: '请输入答案', trigger: 'blur' },
                        { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
                    ],
                    counttime:[
                        { type: 'date', required: true, message: '请选择时间', trigger: 'change' }
                    ],
                    respondent:[
                        { type: 'array', required: true, message: '请至少选择一个答题人', trigger: 'change' }
                    ]
                }
            };
        },
        components: {
            emoji,
            vMessage,
            messageLog,
            VueCountdown
        },
        sockets:{
            org(r) {
                if (r.roomid === this.currSation.id) {
                    this.chatList.push(Object.assign({}, r, {type: 'org'}));
                }
            },
            mes(r) {
                if (r.roomid === this.currSation.id) {
                    if (r.game == 'ans') this.haveAns++;
                    else if (r.game == 'que') this.haveQue++;
                    this.result = 100-this.haveQue-this.haveAns*2;
                    this.chatList.push(Object.assign({}, r, {type: 'other'}));
                    this.$socket.emit('setReadStatus', {roomid: r.roomid, name: this.user.name});
                    this.$store.commit('setUnRead', {roomid: r.roomid, clear: true});
                }
            },
            getHistoryMessages(r) { // 获取历史消息
                if (r.length) {
                    this.$emit('NewMes', r[r.length - 1]);
                }
                this.chatList = r.map(v => {
                    if (v.type !== 'org') {
                        if (v.name === this.user.name) {
                            v.type = 'mine';
                        } else {
                            v.type = 'other';
                        }
                    }
                    return v;
                });
            },
            startgame(r){
                if (r.roomid == this.currSation.id){
                    this.counttime = r.counttime;
                    this.counting = true;
                    this.answer = r.answer;
                    this.haveAns = 0;
                    this.haveQue = 0;
                    this.result = 0;
                    if (r.respondent.indexOf(this.user.id)>-1){
                        this.isRes = true;
                    }
                    else if (r.author.indexOf(this.user.id)>-1){
                        this.isAut = true;
                    }
                    this.chatList.push(Object.assign({}, r, {type: 'game'}));
                }
            },
            win(r){
                if (r.roomid == this.currSation.id){
                    this.result +=2; 
                    this.photoSwipeUrl = '/img/win.gif';
                    this.photoSwipeFlag = true;
                    this.handleCountdownEnd();
                    this.message_game = '';
                    setTimeout(v=>{
                        this.photoSwipeFlag = false;
                        this.photoSwipeUrl = '';
                    },2000)
                }
            }
        },
        computed: {
            ...mapState(['user', 'OnlineUser'])
        },
        watch: {
            currSation: { // 当前会话
                handler(v) {
                    if (!v.id) {
                        this.chatList = [];
                    }
                    this.offset = 1;
                    this.groupUserList = [];
                    this.chatLoading = true;
                    this.currNav = 0; // 标签选中第一个
                    if (v.type === 'group' || v.type === 'friend'){
                        if (v.type === 'group') {
                            this.getGroupUsers(v.id);
                        }
                        this.$socket.emit('setReadStatus', {roomid: v.id, name: this.user.name});
                        this.$store.commit('setUnRead', {roomid: v.id, clear: true});
                        this.$socket.emit('getHistoryMessages', {roomid: v.id, offset: 1, limit: 100});
                    }
                },
                deep: true,
                immediate: true
            },
            OnlineUser: { // 在线成员
                handler(obj) {
                    if (this.currSation.type && this.currSation.type === 'group') {
                        this.getGroupUsers(this.currSation.id);
                    }
                },
                immediate: true,
                deep: true
            },
            currTool(v, old) {
                if (!v) {
                    document.documentElement.removeEventListener('click', this.watchMouse);
                }
            },
            'form.respondent':{
                handler(v){
                    if (this.form.author.indexOf(v[v.length-1])>-1){
                        this.form.author.splice(this.form.author.indexOf(v[v.length-1]),1);
                    }
                }
            },
            'form.author':{
                handler(v){
                    if (this.form.respondent.indexOf(v[v.length-1])>-1){
                        this.form.respondent.splice(this.form.respondent.indexOf(v[v.length-1]),1);
                    }
                }
            }
        },
        mounted() {
        },
        methods: {
            lookPhoto(url) { // 查看原图
            console.log(url);
                this.photoSwipeUrl = url;
                this.photoSwipeFlag = true;
            },
            uploadFileSuccess(res, file) { // 上传成功
                if (file.raw.type.indexOf('image') > -1) {
                    this.send(res.data, 'img');
                } else {
                    this.send(file, 'file');
                }
                this.uplaodVisible.f = false;
            },
            InmageChange(gameORnot = false) { // 发送图片
                let f = this.$refs['chooseInmage'].files[0];
                if (f.type.indexOf('image') === -1) {
                    this.$message.error('只能上传图片!');
                    return;
                }
                const isLt1M = f.size / 1024 / 1024 < 1;
                if (!isLt1M) {
                    this.$message.error('图片大小不能超过 1MB!');
                    return;
                }
                let formdata = new FormData();
                formdata.append('f', f);
                api.uploadFile(formdata).then(r => {
                    if (r.code === 0) {
                        this.send(r.data, 'img',gameORnot);
                    } else {
                        this.$message({
                            message: '上传失败',
                            type: 'warning'
                        })
                    }
                });
                this.$refs['chooseInmage'].value = '';
            },
            getGroupUserStatus(obj) { // 群成员在线状态
                this.groupUsers.forEach((v, i) => {
                    let flag = false;
                    Object.keys(obj).forEach(k => {
                        if (k === v.userName) {
                            flag = true;
                        }
                    });
                    this.$set(this.groupUsers, i, Object.assign({}, v, {status: flag}));
                });
                this.onlineNum = this.groupUsers.filter(v => v.status).length;
            },
            setCurrNav(i) {
                this.currNav = i;
            },
            spreadInput() {
                this.spread = !this.spread;
                this.$nextTick(_ => {
                    this.$refs['searchMember'].focus();
                });
            },
            loadmore() {
                this.loadmoreLoading = true;
                this.offset += 1;
                setTimeout(v => {
                    let page = (this.offset - 1) * this.limit;
                    this.groupUserList = this.groupUserList.concat(this.groupUsers.slice(page, page + this.limit));
                    this.loadmoreLoading = false;
                }, 1000);
            },
            getGroupUsers(id) { // 获取群成员
                let params = {
                    groupId: id
                };
                api.getGroupUsers(params).then(r => {
                    if (r.code === 0) {
                        this.groupUsers = r.data;
                        let page = (this.offset - 1) * this.limit;
                        this.holderId = this.groupUsers.filter(v => v.holder === 1)[0].userId['_id'];
                        this.form.author.push(this.holderId);
                        this.groupUserList = this.groupUsers.slice(page, page + this.limit);
                        /*console.log(this.groupUsers);*/
                        this.getGroupUserStatus(this.OnlineUser);
                    }
                })
            },
            send(params, type = 'mess',gameORnot = false) { // 发送消息
                if (!gameORnot){
                    if (!this.message && !params) {
                        return;
                    }
                    var val = {
                        name: this.user.name,
                        mes: this.message,
                        time: utils.formatTime(new Date()),
                        avatar: this.user.photo,
                        nickname: this.user.nickname,
                        read: [this.user.name],
                        roomid: this.currSation.id,
                        style: 'mess',
                        userM: this.user.id,
                    };
                }
                else {
                    if (!this.message_game && !params) {
                        return;
                    }
                    var val = {
                        name: this.user.name,
                        mes: this.message_game,
                        time: utils.formatTime(new Date()),
                        avatar: this.user.photo,
                        nickname: this.user.nickname,
                        read: [this.user.name],
                        roomid: this.currSation.id,
                        style: 'mess',
                        userM: this.user.id,
                    };
                }
                if (type === 'emoji') { // 发送表情
                    val.style =  'emoji';
                    val.mes = '表情';
                    val.emoji = params;
                } else if (type === 'img') {
                    val.style =  'img';
                    val.mes = '图片';
                    val.emoji = params;
                } else if (type === 'file') {
                    val.style =  'file';
                    val.mes = params.name;
                    val.emoji = params.response.data;
                }
                if (gameORnot){
                    if (this.isAut) val.game = 'que';
                    else if (this.isRes) val.game = 'ans';
                }
                else val.game = false;
                this.chatList.push(Object.assign({},val,{type: 'mine'}));
                this.$socket.emit('mes', val);
                this.$emit('NewMes', val);
                // 判断是否答对题
                if (gameORnot && this.isRes){
                    this.haveAns++;
                    if (this.message_game.trim() == this.answer.trim()){
                        this.handleCountdownEnd();
                        this.message_game = '';
                        this.$socket.emit('win',val);
                        this.photoSwipeUrl = '/img/win.gif';
                        this.photoSwipeFlag = true;
                        setTimeout(v=>{
                            this.photoSwipeFlag = false;
                            this.photoSwipeUrl = '';
                        },2000)
                        return;
                    }
                    this.result = 100 - this.haveQue - this.haveAns *2;
                }
                else if (gameORnot && this.isAut){
                    this.haveQue++;
                    this.result = 100 - this.haveQue - this.haveAns *2;
                }
                
                if (type === 'mess') { // 发送文字
                    if (!gameORnot) this.message = '';
                    else this.message_game = '';
                }
            },
            chooseEmojiDefault(em) {
                this.message += em;
                this.showEmoji.f = false;
            },
            chooseEmoji(url,gameORnot = false) {
                this.send(url, 'emoji',gameORnot);
                this.showEmoji.f = false;
            },
            clear() { // 清空
                this.message = '';
                this.message_game = '';
            },
            startgame(r){
                var _this = this;
                this.$refs[r].validate((valid) => {
                if (valid) {
                    this.photoSwipeUrl = '/img/3.png';
                    this.photoSwipeFlag = true;
                    setTimeout(v=>{
                        _this.photoSwipeUrl = '/img/2.png';
                        setTimeout(v=>{
                            _this.photoSwipeUrl = '/img/1.png';
                                setTimeout(v=>{
                                    _this.photoSwipeFlag = false;
                                    _this.photoSwipeUrl = '';
                                    let nowtime = new Date();
                                    _this.counttime = this.form.counttime - nowtime;
                                    _this.haveAns = 0;
                                    _this.haveQue = 0;
                                    _this.result = 0;
                                    var val = {
                                        answer: _this.form.answer,
                                        roomid: _this.currSation.id,
                                        counttime: _this.counttime,
                                        respondent: _this.form.respondent, // 答题者
                                        author: _this.form.author            //提问者
                                        }          
                                    _this.isAut = true;
                                    _this.counting = true;
                                    _this.chatList.push(Object.assign({}, val, {type: 'game'}));
                                    _this.form = {answer:'',counttime:new Date(),respondent:[],author:[]}
                                    _this.$socket.emit('startgame',val);
                                    _this.dialogFormVisible = false
                                    _this.$message({
                                        showClose: true,
                                        message: '游戏开始',
                                        type: 'success'
                                    });
                            },1000)
                        },1000)
                    },1000)
                    // let nowtime = new Date();
                    // this.counttime = this.form.counttime - nowtime;
                    // this.haveAns = 0;
                    // this.haveQue = 0;
                    // this.result = 0;
                    // var val = {
                    //     answer: this.form.answer,
                    //     roomid: this.currSation.id,
                    //     counttime: this.counttime,
                    //     respondent: this.form.respondent, // 答题者
                    //     author: this.form.author            //提问者
                    //     }          
                    // this.isAut = true;
                    // this.counting = true;
                    // this.chatList.push(Object.assign({}, val, {type: 'game'}));
                    // this.form = {answer:'',counttime:new Date(),respondent:[],author:[]}
                    // this.$socket.emit('startgame',val);
                    // this.dialogFormVisible = false
                    // this.$message({
                    //     showClose: true,
                    //     message: '游戏开始',
                    //     type: 'success'
                    // });
                } else {
                    console.log('error submit!!');
                    return false;
                }
                });
                
            },
            handleCountdownEnd(){
                this.counting = false;
                this.isRes = false;
                this.isAut = false;
                this.answer = '';
                this.chatList.push({type: 'endgame'});
            },
            handleStart(){
                this.form.counttime = new Date();
                this.dialogFormVisible = true
            }
        }
    }
</script>

<style lang="scss" scoped>
    .vchat-item{
        width:100%;
        height: 100%;
        background:url('../../../assets/img/background.jpg');
        .vchat-item-header{
            width:100%;
            height: 32px;
            text-align: left;
            font-size: 16px;
            padding: 0 10px;
            box-sizing: border-box;
            color: #fff;
            background-color: rgba(0,0,0,0.2);
            span{
                display: inline-block;
                height: 100%;
                line-height: 32px;
                padding: 0 5px;
                margin-right: 10px;
                box-sizing: border-box;
                cursor: pointer;
                position: relative;
                opacity: 0.8;
                overflow: hidden;
            }
            span:before{
                content: '';
                display: block;
                width:100%;
                height: 2px;
                background-color: #f5f5f5;
                position: absolute;
                left:0;
                bottom:0;
                /*transition: transform 0.2s;*/
                transform: scale(0);
            }
            span:hover, span.active{
                opacity: 1;
            }
            span.active:before{
                transform: scale(1);
            }
        }
        .vchat-item-container{
            width:100%;
            height: calc(100% - 32px);
            display: flex;
            justify-content: flex-start;
            background-color: rgba(255, 255, 255, 0.6);
            .container-chat{
                width:100%;
                height: 100%;
                min-width: 423.936px;
                box-sizing: border-box;
                border-right: 1px solid rgba(255,255,255,0.3);
                .chat-room {
                    width: 100%;
                    height: 70%;
                    // min-height: 252.2px;
                    box-sizing: border-box;
                    // border-bottom: 1px solid rgba(255, 255, 255, 0.3);
                    overflow: hidden;
                }
                .message-content{
                    width: 100%;
                    height: 100%;
                }
                .chat-send{
                    border:1px solid rgb(189, 189, 189);
                    width:100%;
                    height: 30%;
                    min-height: 200px;
                    color: #160e0e;
                    box-sizing: border-box;
                    background-color: rgba(255, 255, 255, 0.603);
                    .tool{
                        width:100%;
                        height: 28px;
                        line-height: 28px;
                        text-align: left;
                        background-color: rgba(0,0,0,0.3);
                        padding: 0 10px;
                        box-sizing: border-box;
                        .tool-item{
                            display: inline-block;
                            height: 100%;
                            position: relative;
                            i{
                                padding: 0 5px;
                            }
                            .emoji-container{
                                width:400px;
                                height: 260px;
                                position: absolute;
                                bottom: 30px;
                                left:0;
                                z-index: 10;
                                transition: all 0.2s;
                                /*transform: scaleX(0);*/
                                /*opacity: 0;*/
                            }
                            input{
                                position: absolute;
                                left:0;
                                top:0;
                                width:100%;
                                height: 100%;
                                opacity: 0;
                            }
                        }
                        .tool-item:hover{
                            background-color: rgba(255,255,255,0.3);
                        }
                        .tool-item.active{
                            background-color: rgba(255,255,255,0.3);
                        }
                        .tool-item.active .emoji-container{
                            transform: scaleX(1);
                            opacity: 1;
                        }
                        i{
                            margin: 0;
                        }
                    }
                    textarea{
                        width:100%;
                        height: 115px;
                        background-color:transparent;
                        resize: none;
                        outline: none;
                        font-size: 18px;
                        padding: 5px 10px;
                        box-sizing: border-box;
                        border: none;
                    }
                    .enter{
                        width:100%;
                        height: 100%;
                        display: flex;
                        justify-content: flex-end;
                        background: transparent;
                        button{
                            margin-right: 15px;
                        }
                    }
                }
            }
            .container-handel{
                width:32%;
                min-width: 164.864px;
                height: 100%;
                background-color: rgba(255, 255, 255, 0.233);
                h3{
                    font-weight: normal;
                    font-size: 16px;
                    text-align: left;
                    line-height: 16px;
                    margin-bottom: 5px;
                    // i{
                    //     float: right;
                    // }
                }
                .handel-notice{
                    width:100%;
                    height: 50%;
                    color: #160e0e;
                    box-sizing: border-box;
                    border-bottom: 1px solid rgba(180, 180, 180, 0.3);
                    padding: 8px 10px;
                    overflow-y: auto;
                    font-size: 12px;
                    text-align: center;
                    margin: auto;
                    img{
                        height:80px;
                    }
                    h3{
                        text-align: center;
                        
                    }
                    ul{
                        overflow-y: auto;
                        li{
                            margin-bottom: 2px;
                        }
                        li:hover{
                            padding: 2px;
                            box-sizing: border-box;
                            background-color: rgba(255,255,255,0.5);
                            cursor: default;
                        }
                    }
                    p{
                        margin-top: 5px;
                        font-size: 18px;
                    }
                    
                }
                .handel-member{
                    width:100%;
                    height: 60%;
                    box-sizing: border-box;
                    padding: 8px 10px;
                    color: #160e0e;
                    font-size: 12px;
                    ul{
                        overflow-y: auto;
                        height: 100%;
                    }
                    input{
                        box-sizing: border-box;
                        width:100%;
                        border: 1px solid #d5d5d5;
                        padding-left: 5px;
                        outline: none;
                        color: #323232;
                    }
                    li{
                        padding: 5px 0;
                        display: flex;
                        justify-content: flex-start;
                        align-items: center;
                        span{
                            text-align: left;
                        }
                    }
                    li:last-child{
                        padding-bottom: 20px;
                    }
                    .loadmore{
                        width: 100%;
                        text-align: center;
                        cursor: pointer;
                    }
                    a{
                        width:26px;
                        min-width: 26px;
                        height: 26px;
                        margin-right: 5px;
                    }
                }
            }
        }
    }
</style>