import axios  from "axios";
import * as cheerio from "cheerio";

import { baiduHotConfig } from "./config.mjs";
import RedisEngine from "./redis.mjs";


export default class ScrapyBaidu{
    
    start(){
        // 抓取百度排行榜
        axios.get(baiduHotConfig.url,{
            headers:{
                "User-Agent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36"
            }
        }).then(res=>{
            const $ = cheerio.load(res.data)
            const hotItems = $('.category-wrap_iQLoo');
            let baiduHotItems = [];
            hotItems.each((id,el)=>{
                const trendNum =  $(".trend_2RttY .hot-index_1Bl1a",el).text();
                const itemTitle = $(".content_1YWBm .c-single-text-ellipsis",el).text();
                const itemLink = $(".content_1YWBm a").attr("href");
                const itemLable = $('.content_1YWBm .hot-tag_1G080',el).text();
                baiduHotItems.push({
                    trendNum,
                    itemTitle,
                    itemLink,
                    itemLable:itemLable.trim()
                })
            })
            
            RedisEngine.Instance().set('baiduHotRank',JSON.stringify({
                items:baiduHotItems,
                updateTime:Date.now().valueOf(),
                logo:"https://www.baidu.com/favicon.ico"
                
            }),24*60*60);
        })
    }
}







