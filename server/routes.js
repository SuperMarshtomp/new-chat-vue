let express = require('express');
let router = express.Router();

const api = require('./controller/apiList');
const uploads = require('./utils/upload'); // 上传js
const utils = require('./utils/utils');

router.post('/v/api/uploadFile', uploads.uploadFile.single('f'), (req, res) => { // 上传
    let date = utils.formatTime(new Date()).split(' ')[0];
    res.json({
        code: 0,
        data: '/uploads/' + date + '/' + req.file.filename
    });
});

router.post('/v/expre/getExpression', api.getExpression); // 获取表情库

router.post('/v/friend/findMyfriends', api.findMyfriends); // 查找我的好友
router.post('/v/friend/checkMyfriends', api.checkMyfriends); // 验证是否已加为好友 

router.post('/v/group/createGroup', api.createGroup); // 新建群
router.post('/v/group/getMyGroup', api.getMyGroup); // 查找我的群聊
router.post('/v/group/getGroupUsers', api.getGroupUsers); // 查找指定群聊成员
router.post('/v/group/huntGroups', api.huntGroups); // 搜索聊天群（名称/code）
router.post('/v/group/getGroupInfo', api.getGroupInfo);  // 查找群详细信息

router.post('/v/mes/removeMessage', api.removeMessage); // 删除消息
router.post('/v/mes/loadMoreMessages', api.loadMoreMessages); // 加载更多消息

router.get('/v/user/getUser', api.getUser); // 获取用户、测试接口
router.post('/v/user/login', api.login); // 登录
router.post('/v/user/signUp', api.signUp); // 注册

router.post('/v/user/upUserInfo', api.upUserInfo); // 修改个人信息、主题等
router.post('/v/user/loginOut', api.loginOut); // 退出
router.post('/v/user/getUserInfo', api.getUserInfo); // 登录状态获取用户信息
router.post('/v/user/getUserDetail', api.getUserDetail); // 登录状态获取用户详细信息
router.post('/v/user/getVchatInfo', api.getVchatInfo); // 获取系统信息
router.post('/v/user/addConversitionList', api.addConversitionList); // 添加会话
router.post('/v/user/removeConversitionList', api.removeConversitionList); // 移除会话
router.post('/v/user/huntFriends', api.huntFriends); // 搜索好友

module.exports = router;