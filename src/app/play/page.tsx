"use client";

import ThemeButton from "@/components/changeThemeButton";
import Drawer from "@/components/drawer";
import { Room } from "@/types";
import Button from "@mui/material/Button";
import Image from "next/image";
import { useState } from "react";
import { useSocket, useSocketOn } from "./hooks/useSocket";
import { Join } from "./join";

export default function Home() {
    const [isJoined, setIsJoined] = useState(false);

    //game
    const [room, setRoom] = useState<Room | null>(null);
    //socket.io
    useSocketOn("roomUpdate", (updatedRoom) => {
        setRoom(updatedRoom);
    });
    //dom
    return (
        <>
            {isJoined || (
                <Join
                    onJoin={() => {
                        setIsJoined(true);
                    }}
                />
            )}
            {room?.status == "waiting" && <Waiting room={room} />}
            {room?.status == "playing" && <Playing room={room} />}
            {room?.status == "reviewing" && <Reviewing room={room} />}
            <ThemeButton />
        </>
    );
}

function Waiting({ room }: { room: Room }) {
    const socket = useSocket();
    const handleGameStart = () => {
        socket.emit("GameStart");
    };
    return (
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
                    <Button onClick={handleGameStart} variant="outlined">
                        ゲーム開始
                    </Button>
                </div>
            </div>
        </>
    );
}

function Playing({ room }: { room: Room }) {
    const socket = useSocket();
    const submitAnswer = (imageData: string) => {
        socket.emit("submitAnswer", { answer: imageData });
    };
    const handleFinishAnswer = () => {
        socket.emit("finishAnswer");
    };
    return (
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
    );
}

function Reviewing({ room }: { room: Room }) {
    const socket = useSocket();
    const handleComplete = () => {
        socket.emit("complete");
    };
    const handleNext = () => {
        socket.emit("next");
    };
    return (
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
    );
}
