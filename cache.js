import { createClient } from 'redis';

let cache;

async function cacheConnect() {
    cache = createClient({
        url: process.env.REDIS_URL,
        password: process.env.REDIS_PASS
    });
    
    cache.on('error', (err) => console.log('Redis client error:', err));
    
    cache.connect();
}

cacheConnect().catch(err => { console.log(err) });

export default cache;