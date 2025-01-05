"use client";

import ThemeButton from "@/components/changeThemeButton";
import Drawer from "@/components/drawer";
import { Room } from "@/types";
import Button from "@mui/material/Button";
import Image from "next/image";
import { useEffect, useState } from "react";
import io from "socket.io-client";
import type { MySocket } from "./hooks/useSocket";

const socket = io(process.env.NEXT_PUBLIC_SOCKET_SERVER) as MySocket;

export default function Home() {
    const [isJoined, setIsJoined] = useState(false);
    const [joinName, setJoinName] = useState("");
    const handleJoin = () => {
        if (!joinName) return;
        socket.emit("joinRoom", { joinName });
        setIsJoined(true);
    };
    //game
    const [room, setRoom] = useState<Room | null>(null);
    const handleGameStart = () => {
        socket.emit("GameStart");
    };
    const submitAnswer = (imageData: string) => {
        socket.emit("submitAnswer", { answer: imageData });
    };
    const handleFinishAnswer = () => {
        socket.emit("finishAnswer");
    };
    const handleComplete = () => {
        socket.emit("complete");
    };
    const handleNext = () => {
        socket.emit("next");
    };
    //socket.io
    useEffect(() => {
        socket.on("roomUpdate", (updatedRoom) => {
            setRoom(updatedRoom);
        });

        return () => {
            socket.off("roomUpdate");
        };
    }, []);
    //dom
    if (!isJoined) {
        return (
            <>
                <div className="max-w-lg p-4 mx-auto">
                    <h1 className="text-center text-2xl my-8">部屋に参加</h1>
                    <div className="flex place-content-center gap-x-4">
                        <input
                            onChange={(e) => {
                                setJoinName(e.target.value);
                            }}
                            className="border-2 py-3 px-4 border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                            placeholder="参加する名前"
                        />
                        <Button onClick={handleJoin} variant="outlined">
                            参加
                        </Button>
                    </div>
                </div>
                <ThemeButton />
            </>
        );
    }
    return (
        <>
            {room?.status == "waiting" ? (
                <>
                    <div className="max-w-lg mx-auto p-4">
                        <div>
                            <h3 className="text-xl font-bold text-center my-4">
                                現在の参加者一覧
                            </h3>
                            <ul className="m-4">
                                {room?.participants.map((participant) => (
                                    <li
                                        className="text-lg list-disc"
                                        key={participant.id}
                                    >
                                        {participant.name}
                                    </li>
                                ))}
                            </ul>
                            <Button
                                onClick={handleGameStart}
                                variant="outlined"
                            >
                                ゲーム開始
                            </Button>
                        </div>
                    </div>
                </>
            ) : (
                <></>
            )}
            {room?.status == "playing" ? (
                <>
                    <h1 className="text-center text-2xl my-4">
                        お題 {room?.currentTopic}
                    </h1>
                    <p className="text-center">
                        {room?.currentRound}ラウンド目 / {room?.completedRounds}
                        回一致
                    </p>
                    <Drawer onSubmit={submitAnswer} />
                    <div className="max-w-lg mx-auto p-4">
                        <h3 className="text-lg font-bold">書き終わった人</h3>
                        <ul className="my-4">
                            {room?.participants.map((participant) => {
                                if (participant.hasSubmitted) {
                                    return (
                                        <li key={`${participant.id}_1`}>
                                            {participant.name}
                                        </li>
                                    );
                                }
                            })}
                        </ul>
                        <Button variant="outlined" onClick={handleFinishAnswer}>
                            回答を締め切る
                        </Button>
                        <p>※回答開示画面に移動します</p>
                    </div>
                </>
            ) : (
                <></>
            )}
            {room?.status == "reviewing" ? (
                <>
                    <h1 className="text-center text-2xl my-4">
                        お題 {room?.currentTopic}
                    </h1>
                    <div className="grid grid-cols-2 gap-4">
                        {room.participants.map((participant) => (
                            <div
                                key={participant.id}
                                className="flex place-content-center"
                            >
                                <div>
                                    <h4>{participant.name}</h4>
                                    {participant.answer && (
                                        <Image
                                            width={480}
                                            height={270}
                                            src={participant.answer}
                                            alt={`${participant.name}の回答`}
                                            className="border-2 rounded-md bg-white"
                                        />
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex place-content-center gap-x-4 my-4">
                        <Button variant="outlined" onClick={handleComplete}>
                            揃った！
                        </Button>
                        <Button variant="outlined" onClick={handleNext}>
                            揃わず...
                        </Button>
                    </div>
                </>
            ) : (
                <></>
            )}
            <ThemeButton />
        </>
    );
}
