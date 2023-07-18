import express from 'express';
import next from 'next';
import { dmxReceived } from './business-logic/redux/currentDmxSlice';
import { observeStore, store } from './business-logic/redux/store';
import { configureWebsockets } from './business-logic/websockets';
import { ReceiverConfiguration } from './models';
import { configureReceiver } from './sacn/sacnReceiver';

const port = parseInt(process?.env?.PORT ?? '3001', 10);
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const logPrefix = '[INFO]';
const appName = 'sACN Scene Viewver';
const universes = JSON.parse(process.env.NEXT_PUBLIC_UNIVERSES_JSON ?? '[1]');
const priority = 90;

app.prepare().then(async () => {
    const server = express();

    // Configure sACN
    //
    const receiverConfiguration: ReceiverConfiguration = {
        universes: universes,
        appName: appName,
        onReceive: (dmxUniverseState) => {
            store.dispatch(dmxReceived(dmxUniverseState));

            websocketsData.broadcast(JSON.stringify(store.getState().currentDmx), false);
        },
    };
    configureReceiver(receiverConfiguration);

    // Configure WebSockets
    //
    const websocketsData = configureWebsockets();

    // Configure next js
    //
    server.all('/api/resetWebSockets', async (_req, res) => {
        websocketsData.closeAll();
        console.log(logPrefix, 'Close all WebSockets');
        res.send('WebSockets closed');
    });

    server.all('*', (req, res) => {
        return handle(req, res);
    });

    server.listen(port, () => {
        console.log(`> Ready on http://localhost:${port}`);
    });
});
