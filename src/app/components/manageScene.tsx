'use client';

import { SceneData, WebsocketCommand } from '@/models';
import { FC, useState } from 'react';
import { SliderPicker } from 'react-color';

type Props = {
    disabled: boolean;
    sceneToEdit: SceneData;
    setSceneToEdit: (updateFunction: (scene: SceneData | null) => SceneData | null) => void;
    sendCommand: (command: WebsocketCommand) => void;
};

const ManageScene: FC<Props> = ({ disabled, sceneToEdit, setSceneToEdit, sendCommand }: Props) => {
    const universes: number[] = JSON.parse(process.env.NEXT_PUBLIC_UNIVERSES_JSON ?? '[1]');
    const [selectedUniverses, setSelectedUniverses] = useState<number[]>(universes);

    return (
        <form className="bg-white shadow-md rounded px-6 pt-4 pb-6 mb-4 w-full">
            <div className="flex justify-between">
                <h1 className="text-gray-900 font-semibold">Manage scene &quot;{sceneToEdit?.name}&quot;</h1>
                <button
                    className="bg-indigo-500 hover:bg-indigo-700 disabled:bg-gray-700 text-xs text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    type="button"
                    onClick={() => setSceneToEdit(() => null)}
                >
                    Close
                </button>
            </div>
            <div className="flex gap-4 flex-col md:flex-row">
                <div className="grow">
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                            Name
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-sm"
                            type="text"
                            id="name"
                            placeholder="My favorite scene"
                            value={sceneToEdit.name}
                            onChange={(e) =>
                                setSceneToEdit((x) => (x === null ? null : { ...x, name: e.target.value ?? '' }))
                            }
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="color">
                            Color
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-3 text-sm"
                            type="text"
                            id="color"
                            placeholder="#374151"
                            value={sceneToEdit.color}
                            onChange={(e) =>
                                setSceneToEdit((x) => (x === null ? null : { ...x, color: e.target.value ?? '' }))
                            }
                        />
                        <SliderPicker
                            color={sceneToEdit.color}
                            onChange={(color) =>
                                setSceneToEdit((x) => (x === null ? null : { ...x, color: color.hex }))
                            }
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="sortIndex">
                            SortIndex
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-sm"
                            type="number"
                            id="sortIndex"
                            placeholder="0"
                            value={sceneToEdit.sortIndex}
                            onChange={(e) =>
                                setSceneToEdit((x) =>
                                    x === null ? null : { ...x, sortIndex: parseInt(e.target.value ?? '') },
                                )
                            }
                        />
                    </div>
                    <div className="flex items-center justify-end">
                        <button
                            className="bg-indigo-500 hover:bg-indigo-700 disabled:bg-gray-700 text-xs text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            type="button"
                            onClick={() =>
                                sendCommand({
                                    type: 'update',
                                    sceneId: sceneToEdit.id,
                                    metadata: {
                                        name: sceneToEdit.name,
                                        color: sceneToEdit.color,
                                        category: sceneToEdit.category,
                                        sortIndex: sceneToEdit.sortIndex,
                                    },
                                })
                            }
                            disabled={disabled}
                        >
                            Save
                        </button>
                    </div>
                </div>
                <div className="min-w-72">
                    <div className="flex flex-col gap-3">
                        <div className="bg-gray-200 rounded shadow-md py-4 px-4 my-3">
                            <span className="block text-gray-700 text-sm font-bold mb-2">Universes</span>
                            <div className="mb-3 flex gap-3">
                                {universes.map((universeId) => (
                                    <button
                                        key={universeId}
                                        className={
                                            'text-white font-bold py-2 px-2 text-xs rounded focus:outline-none focus:shadow-outline disabled:bg-gray-700 w-10 ' +
                                            (selectedUniverses.some((x) => x === universeId)
                                                ? 'bg-teal-500 hover:bg-teal-700'
                                                : 'bg-indigo-500 hover:bg-indigo-700')
                                        }
                                        type="button"
                                        onClick={() => {
                                            setSelectedUniverses((universes) =>
                                                universes.some((x) => x === universeId)
                                                    ? universes.filter((x) => x !== universeId)
                                                    : [universeId, ...universes],
                                            );
                                        }}
                                        disabled={disabled}
                                    >
                                        {universeId}
                                    </button>
                                ))}
                            </div>
                            <button
                                className="bg-indigo-500 hover:bg-indigo-700 disabled:bg-gray-700 text-xs text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
                                type="button"
                                onClick={() => {
                                    sendCommand({
                                        type: 'storeDmx',
                                        sceneId: sceneToEdit.id,
                                        universes: selectedUniverses,
                                    });
                                }}
                                disabled={disabled || selectedUniverses.length === 0}
                            >
                                Save DMX
                            </button>
                            <button
                                className="bg-indigo-500 hover:bg-indigo-700 disabled:bg-gray-700 text-xs text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-3 w-full"
                                type="button"
                                onClick={() => {
                                    sendCommand({
                                        type: 'removeDmx',
                                        sceneId: sceneToEdit.id,
                                        universes: selectedUniverses,
                                    });
                                }}
                                disabled={disabled || selectedUniverses.length === 0}
                            >
                                Remove DMX
                            </button>
                        </div>
                        <button
                            className="bg-red-500 hover:bg-red-700 disabled:bg-gray-700 text-xs text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            type="button"
                            onClick={() => {
                                sendCommand({
                                    type: 'delete',
                                    sceneId: sceneToEdit.id,
                                });
                                setSceneToEdit(() => null);
                            }}
                            disabled={disabled}
                        >
                            Delete scene
                        </button>
                    </div>
                </div>
            </div>
        </form>
    );
};

export default ManageScene;
