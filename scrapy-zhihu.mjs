import axios  from "axios";

import { zhihuHotConfig } from "./config.mjs";
import RedisEngine from "./redis.mjs";


export default class ScrapyZhihu{
    start(){
        axios.get(zhihuHotConfig.url).then(res=>{
            const {data} = res.data;
            let zhihuHotItems = [];
            data.map(item=>{
                zhihuHotItems.push({
                    trendNum:item.detail_text,
                    itemTitle:item.target.title,
                    itemLink:`https://www.zhihu.com/question/${item.target.id}`,
                    itemLabel:'',
                    itemCategory:''
                })
            })
            RedisEngine.Instance().set('zhihuHotRank',JSON.stringify({
                logo:"https://static.zhihu.com/heifetz/favicon.ico",
                items:zhihuHotItems,
                updateTime:Date.now().valueOf()
            }),24*60*60)
        })

    }
}



