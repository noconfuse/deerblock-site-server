import axios  from "axios";

import { weiboHotConfig } from "./config.mjs";
import RedisEngine from "./redis.mjs";

// RedisEngine.Instance().connect();

export default class ScrapyWeibo{
    start(){
        //微博排行榜
        axios.get(weiboHotConfig.url).then(res=>{
            const {data:{band_list}} = res.data;
            let weiboHotItems = [];
            band_list.map(item=>{
                if(item.raw_hot){
                    weiboHotItems.push({
                        trendNum:item.raw_hot,
                        itemTitle:item.note,
                        itemLink:`https://s.weibo.com/weibo?q=${encodeURIComponent(item.word_scheme)}`,
                        itemLabel:item.label_name,
                        itemCategory:item.category
                    })
                }
            })
            RedisEngine.Instance().set('weiboHotRank',JSON.stringify({
                items:weiboHotItems,
                logo:"https://weibo.com/favicon.ico",
                updateTime:Date.now().valueOf()
            }),24*60*60)
        })
    }
}




