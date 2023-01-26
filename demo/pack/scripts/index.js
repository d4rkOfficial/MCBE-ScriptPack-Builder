import * as Server from '@minecraft/server';
Server.world.events.worldInitialize.subscribe(() => {
    Server.world.say('Hello, world!');
});
