import { createClient } from 'redis';

let cache;

async function cacheConnect() {
    cache = createClient({
        url: 'rediss://gdinterface.redis.cache.windows.net:6380',
        password: 'W8WiPbJpnUjuqvsV92d2LbkxRzyPHeY2HAzCaBy8C0Y='
    });
    
    cache.on('error', (err) => console.log('Redis client error:', err));
    
    cache.connect();
}

cacheConnect().catch(err => { console.log(err) });

export default cache;