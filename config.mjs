export const baiduHotConfig = {
    url:"https://top.baidu.com/board?tab=realtime",
    type:'html',
    dataKey:'baiduHotRank'
}
export const weiboHotConfig = {
    url:"https://weibo.com/ajax/statuses/hot_band",
    type:"api",
    dataKey:'weiboHotRank'
}

export const toutiaoHotConfig = {
    url:"https://www.toutiao.com/hot-event/hot-board/?origin=toutiao_pc",
    type:'api',
    dataKey:'toutiaoHotRank'
}


export const zhihuHotConfig = {
    url:"https://www.zhihu.com/api/v3/feed/topstory/hot-lists/total?limit=50&desktop=true",
    type:"api",
    dataKey:'zhihuHotRank'
}

export const bilibiliConfig = {
    url:"https://app.bilibili.com/x/v2/search/trending/ranking",
    type:"api",
    dataKey:'bilibiliHotRank'
}