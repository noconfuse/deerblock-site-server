import axios  from "axios";

import { toutiaoHotConfig } from "./config.mjs";
import RedisEngine from "./redis.mjs";

// RedisEngine.Instance().connect();

export default class ScrapyToutiao{
    start(){
        axios.get(toutiaoHotConfig.url).then(res=>{
            const {data} = res.data;
            let toutiaoHotItems = [];
            data.map((item,index)=>{
                toutiaoHotItems.push({
                    trendNum:item.HotValue,
                    itemTitle:item.Title,
                    itemLink:`https://www.toutiao.com/trending/${item.ClusterId}/?rank=${index+1}`,
                    itemLabel:item.Label =='hot'?"热":item.Label =='new'?"新":'',
                    itemCategory:encodeURI(item.InterestCategory)
                })
            })
            RedisEngine.Instance().set('toutiaoHotRank',JSON.stringify({
                logo:"https://lf1-cdn-tos.bytescm.com/obj/cdn-static-resource/static/v2/resource/pgc_wap/static/style/image/favicon.15202a4.png",
                items:toutiaoHotItems,
                updateTime:Date.now().valueOf()
            }),24*60*60)
        })

    }
}




