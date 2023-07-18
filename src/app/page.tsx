'use client';

import { DmxUniverseData, UniverseData } from '@/models';
import { useState } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';

export default function Home() {
    const universes: number[] = JSON.parse(process.env.NEXT_PUBLIC_UNIVERSES_JSON ?? '[1]');
    const [selectedUniverseId, setSelectedUniverseId] = useState<number>(1);
    const [isEditing, setIsEditing] = useState(false);

    const webSocketUrl = 'ws://' + process.env.NEXT_PUBLIC_HOST + ':8081';
    const { lastJsonMessage, lastMessage, readyState } = useWebSocket<UniverseData>(webSocketUrl, {
        shouldReconnect: () => true,
    });
    const connectionStatus = {
        [ReadyState.CONNECTING]: 'Connecting',
        [ReadyState.OPEN]: 'Connected ✓',
        [ReadyState.CLOSING]: 'Closing',
        [ReadyState.CLOSED]: 'Closed',
        [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
    }[readyState];

    const universeData = lastJsonMessage ? lastJsonMessage[selectedUniverseId] : null;
    const dmxChannels = Array.from({ length: 512 }, (_, k) => k + 1);

    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-8 md:p-16">
            <div className="z-10 w-full max-w-6xl items-center font-mono text-sm md:flex items-baseline">
                <p className="text-2xl mb-2 flex-grow">sACN Scene Recorder</p>
                <p className="mb-2 mr-3">Status: {connectionStatus}</p>
                <div className="text-right">
                    <button
                        className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 text-xs rounded focus:outline-none focus:shadow-outline w-full md:w-32"
                        type="button"
                        onClick={() => setIsEditing((x) => !x)}
                    >
                        {isEditing ? 'Stop editing' : 'Edit'}
                    </button>
                </div>
            </div>

            <div className="w-full max-w-6xl">
                <div>
                    <span className="block text-gray-700 text-sm font-bold mb-2">Universes</span>
                    <div className="mb-3 flex gap-3 items-baseline">
                        {universes.map((universeId) => (
                            <button
                                key={universeId}
                                className={
                                    'text-white font-bold py-2 px-2 text-xs rounded focus:outline-none focus:shadow-outline disabled:bg-gray-700 w-10 ' +
                                    (selectedUniverseId === universeId
                                        ? 'bg-teal-500 hover:bg-teal-700'
                                        : 'bg-indigo-500 hover:bg-indigo-700')
                                }
                                type="button"
                                onClick={() => setSelectedUniverseId(universeId)}
                            >
                                {universeId}
                            </button>
                        ))}
                        <span className="text-sm text-gray-200">
                            Source: {universeData?.sender} / Priority: {universeData?.priority} / Last received:{' '}
                            {universeData?.lastReceived}
                        </span>
                    </div>
                </div>

                {universeData ? (
                    <div className="gap-1 text-gray-900 text-center grid grid-cols-[1fr,1fr,1fr,1fr,1fr,1fr,1fr,1fr,1fr,1fr,1fr,1fr,1fr,1fr,1fr,1fr,1fr,1fr,1fr,1fr,1fr,1fr,1fr,1fr,1fr,1fr,1fr,1fr,1fr,1fr,1fr,1fr]">
                        {dmxChannels.map((dmxChannelId) => (
                            <div
                                key={dmxChannelId}
                                title={universeData.dmx[dmxChannelId]?.toString()}
                                className={
                                    'px-1 py-2 w-8 h-8 text-xs ' +
                                    (universeData.dmx[dmxChannelId] > 0 ? 'text-white' : 'text-gray-500')
                                }
                                style={{
                                    backgroundColor:
                                        'rgba(20, 184, 166, ' + (universeData.dmx[dmxChannelId] ?? 0) * 0.01 + ')',
                                }}
                            >
                                <h1>{dmxChannelId}</h1>
                            </div>
                        ))}
                    </div>
                ) : null}
            </div>

            <div className="relative flex place-items-center text-slate-50 text-opacity-50 mt-3">
                <small>sACN Scene Recorder v0.1</small>
            </div>
        </main>
    );
}
