import express from "express";
import RedisEngine from "./redis.mjs";
import schedule from 'node-schedule';
import ScrapyBaidu from "./scrapy-baidu.mjs";
import ScrapyWeibo from "./scrapy-weibo.mjs";
import ScrapyZhihu from "./scrapy-zhihu.mjs";
import ScrapyBilibili from "./scrapy-bilibili.mjs";
import ScrapyToutiao from "./scrapy-toutiao.mjs";
import ScrapyIT from "./scrapy-IT.mjs";
import axios from "axios";

RedisEngine.Instance().connect();


const app = express();


app.all("*", function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");

    res.header("Access-Control-Allow-Headers", "X-Requested-With");

    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");

    res.header("X-Powered-By", " 3.2.1");

    res.header("Content-Type", "application/json;charset=utf-8");

    next();
});


app.get('/rankList', function (req, res) {
    const query = req.query;
    if (!query.queryType) {
        res.json([])
    }
    const queryTypes = query.queryType.split(',');
    let response = {};
    queryTypes.map((type, index) => {
        let dataKey = 'baiduHotRank';
        switch (type) {
            case "1":
                dataKey = 'baiduHotRank';
                break;
            case "2":
                dataKey = 'weiboHotRank';
                break;
            case "3":
                dataKey = "zhihuHotRank";
                break
            case "4":
                dataKey = "toutiaoHotRank"
                break;
            case "5":
                dataKey = "bilibiliHotRank"
                break;
            case "6":
                dataKey = "ITHotRank"
                break;
            default:
        }
        RedisEngine.Instance().get(dataKey).then(result => {
            response[dataKey] = JSON.parse(result);
            if (index === queryTypes.length - 1) {
                res.json(response);
            }
        })
    })
})

app.get('/weather', function (req, res) {
    const query = req.query;
    const { city, pageNo, pageSize, latitude, longitude } = query;
    axios.get('http://autodev.openspeech.cn/csp/api/v2.1/weather', {
        params: {
            city,
            pageNo,
            pageSize,
            latitude,
            longitude,
            clientType: 'android',
            sign: 'android',
            openId: "aiuicus"
        }
    }).then((response) => {
        res.json(response.data)
    })
})



const server = app.listen(3001, function () {
    var host = server.address().address;

    var port = server.address().port;

    console.log("Example app listening at http://%s:%s", host, port);
});


// 开始抓取排行榜任务
const rule = new schedule.RecurrenceRule();
rule.minute = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];//每分钟的10秒执行任务

const baiduTask = new ScrapyBaidu();
const weiboTask = new ScrapyWeibo();
const zhihuTask = new ScrapyZhihu();
const bilibiliTask = new ScrapyBilibili();
const toutiaoTask = new ScrapyToutiao();
const ITTask = new ScrapyIT();


const job = schedule.scheduleJob(rule, function () {
    console.log("开始抓取")
    baiduTask.start();
    weiboTask.start();
    zhihuTask.start();
    bilibiliTask.start();
    toutiaoTask.start();
    ITTask.start();
})
