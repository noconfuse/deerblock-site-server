import axios  from "axios";

import { bilibiliConfig } from "./config.mjs";
import RedisEngine from "./redis.mjs";

export default class ScrapyBilibili{
    start(){
        //RedisEngine.Instance().connect();
        //微博排行榜
        axios.get(bilibiliConfig.url,{
            params:{
                limit:"50",
            }
        }).then(res=>{
            const {data:{list}} = res.data;
            let bilibiliHotItems = [];
            list.map(item=>{
                bilibiliHotItems.push({
                    trendNum:'',
                    itemTitle:item.show_name,
                    itemLink:`https://search.bilibili.com/all?keyword=${encodeURIComponent(item.keyword)}&from_source=webtop_search`,
                    itemLabel:item.word_type==4?"新":item.word_type==5?"热":"",
                    itemCategory:''
                })
            })
            RedisEngine.Instance().set('bilibiliHotRank',JSON.stringify({
                items:bilibiliHotItems,
                updateTime:Date.now().valueOf(),
                logo:"https://www.bilibili.com/favicon.ico?v=1"
            }),24*60*60)
        })
    }
}



