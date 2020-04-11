const express = require('express');
const body_parser = require('body-parser');
const formidable = require('formidable');
const MongoClient = require('mongodb').MongoClient;
var session = require('express-session');
let url = "mongodb://localhost:27017/runoob";
const path = require('path');
const app = express();
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'onloads')));
app.use(body_parser.urlencoded()); // 可以改成json
// 实现session功能
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
}));

// 连接数据库
function ADDdb(data) {
    MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true}, function (err, db) {
// 创建数据库
// 创建数据库名称
        var dbase = db.db('my_project'); // runoob
        console.log("数据库已连接!");
// 如果插入数组就使用insertMany
// 插入单个对象就用insertOne
        dbase.collection('user').insertOne(data, function (err, res) { // site
            if (err) throw err;
            console.log('创建集合');
            db.close();
        });
    });
}

app.post('/login', (req, res) => {
    ADDdb(req.body);
    res.send(req.body)
});
app.post('/image', (req, res) => {
    const form = new formidable.IncomingForm();
    form.uploadDir = path.join(__dirname, 'public', 'onloads');
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
        res.send(files.avatar.path.split('public')[1]);
    })
});

app.post('/username', (req, res) => {
    MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true}, function (err, db) {
        var dbase = db.db('my_project'); // runoob
        console.log("数据库已连接!");
        dbase.collection('user').find({username: req.body.username}).toArray(function (err, doc) { // site
            if (err) throw err;
            if (doc.length < 1) {
                res.send({message: '用户名可以注册', status: 200});
            } else {
                res.send({message: '用户名已存在', status: 400});
            }
            db.close();
        });
    });
});

// 登录验证
app.post('/enter', (req, res) => {
    MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true}, function (err, db) {
        var dbase = db.db('my_project'); // runoob
        console.log("数据库已连接!");
        dbase.collection('user').find({username: req.body.username}).toArray(function (err, doc) { // site
            if (err) throw err;
            console.log(doc.length);
            if (doc.length >= 1) {
                console.log(req.body.password);
                if (doc[0].password === req.body.password) {
                    req.session.isLogin = true;
                    res.send({message: '验证成功', uid: doc[0]._id})
                } else {
                    res.status(400).send('密码错误')
                }
            } else {
                res.status(400).send('用户名不存在')
            }
            db.close();
        });
    });
});
// jsonp 验证登录状态
app.get('/judge', (req, res) => {
    if (req.session.isLogin) {
        let result = 'fn(' + req.session.isLogin + ')';
        res.send(result)
    } else {
        let result = 'fn(' + req.session.isLogin + ')';
        res.send(result);
    }
});

// 登录成功根据id获取数据库个人信息
app.post('/gain', (req, res) => {
    // 与数据库默认db进行匹配
    var ObjectID = require('mongodb').ObjectId;
    MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true}, function (err, db) {
        var dbase = db.db('my_project');
        console.log("数据库已连接!");
        dbase.collection('user').find({"_id": new ObjectID(req.body.ids)}).toArray(function (err, doc) {
            console.log(doc);
            if (err) throw err;
            if (doc.length >= 1) {
                res.send(doc)
            }
            db.close();
        });
    });
});
app.listen(3000);
console.log('服务器启动成功');
