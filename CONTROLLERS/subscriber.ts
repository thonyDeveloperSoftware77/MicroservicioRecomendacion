import * as redis from 'redis';

const subscriber = redis.createClient();

subscriber.subscribe('recommendations', (channel, message) => {
    console.log(`Received the following message from ${channel}: ${message}`);
});
