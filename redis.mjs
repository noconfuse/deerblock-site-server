// redis配置参数
import redis from 'redis';

class RedisEngine{
  static _instance;
  static Instance(){
    if(!RedisEngine._instance){
      RedisEngine._instance = new RedisEngine()
    }
    return RedisEngine._instance;
  }

  config = {
    host: "127.0.0.1",
    port: 6379,
  }

  connected = false

  client = null;

  onError(err){
    console.log(err)
  }

  constructor(){
    this.client = redis.createClient(this.config);
    this.client.on('error',this.onError)
  }

  connect(){
    this.client.connect().then(()=>{
      this.connected = false;
    })
  }

  disconnect(){
    this.client.disconnect();
  }

  rpush(...args){
    return new Promise((resolve, reject) => {
      this.client.rpush(...args, function(err, value) {
        if (err) reject(err);
        else resolve(value);
      });
    });
  }

  rpop(...args){
    return new Promise((resolve, reject) => {
      this.client.rpop(...args, function(err, value) {
        if (err) reject(err);
        else resolve(value);
      });
    });
  }
  lrange(...args){
    return new Promise((resolve, reject) => {
      this.client.lrange(...args, function(err, value) {
        if (err) reject(err);
        else resolve(value);
      });
    });
  }

  set(key, value, expireTime){
    return new Promise((resolve, reject) => {
      this.client.expire(key, expireTime);
      return this.client.set(key, value);
    });
  }

  get(...args){
    return this.client.get(...args);
  }
}


export default RedisEngine;