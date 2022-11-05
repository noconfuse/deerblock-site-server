import axios from "axios";
import * as cheerio from "cheerio";


import { ITConfig } from "./config.mjs";
import RedisEngine from "./redis.mjs";


export default class ScrapyIT {
    start() {
        axios.get(ITConfig.url).then(res => {
            const $ = cheerio.load(res.data)
            const hotRank = $('#rank #d-1 li a');
            let ITHotItems = []
            hotRank.each((id, el) => {
                ITHotItems.push({
                    itemTitle: $(el).text(),
                    itemLink: $(el).attr('href'),
                })
            })
            RedisEngine.Instance().set('ITHotRank', JSON.stringify({
                items: ITHotItems,
                updateTime: Date.now().valueOf(),
                logo: "https://www.ithome.com/favicon.ico"

            }), 24 * 60 * 60);
        })

    }
}



