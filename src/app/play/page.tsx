"use client"

import Button from "@mui/material/Button"
import TextField from "@mui/material/TextField"
import { useEffect, useState } from "react"
import io from 'socket.io-client';
import { Room } from '@/types';
import Image from 'next/image'
import Drawer from "@/components/drawer";

const socket = io('https://lounge-rev.deno.dev/');

export default function Home() {
    const [isJoined, setIsJoined] = useState(false)
    const [joinName, setJoinName] = useState("")
    const handleJoin = async () => {
        if (!joinName) return;
        socket.emit("joinRoom", { joinName })
        setIsJoined(true)
    }
    //game
    const [room, setRoom] = useState<Room | null>(null);
    const handleGameStart = async () => {
        socket.emit("GameStart")
    }
    const submitAnswer = (imageData: string) => {
        socket.emit("submitAnswer", { answer: imageData });
    };
    const handleFinishAnswer = async () => {
        socket.emit("finishAnswer")
    }
    const handleComplete = async () => {
        socket.emit("complete")
    }
    const handleNext = async () => {
        socket.emit("next")
    }
    //socket.io
    useEffect(() => {
        socket.on("roomUpdate", (updatedRoom) => {
            setRoom(updatedRoom);
        });

        return () => {
            socket.off("room-update");
        };
    }, []);
    //dom
    if (!isJoined) {
        return (<>
            <h1 className="text-center text-lg">部屋に参加</h1>
            <div className="flex place-content-center gap-x-4">
                <TextField label="参加名" variant="standard" onChange={(e) => { setJoinName(e.target.value) }} />
                <Button onClick={handleJoin} variant="outlined">参加</Button>
            </div>
        </>)
    }
    return (
        <>
            {room?.status == 'waiting' ?
                <>
                    <div className="mt-4">
                        <h3 className="text-lg font-bold">参加者一覧</h3>
                        <ul>
                            {room?.participants.map((participant) => (
                                <li key={participant.id}>
                                    {participant.name}
                                </li>
                            ))}
                        </ul>
                        <Button onClick={handleGameStart} variant="outlined">ゲーム開始</Button>
                    </div>
                </>
                : <></>}
            {room?.status == "playing" ? <>
                <h1 className="text-center text-2xl my-4">お題 {room?.currentTopic}</h1>
                <p className="text-center">{room?.currentRound}ラウンド目 / {room?.completedRounds}回一致</p>
                <Drawer onSubmit={submitAnswer} />
                <div>
                    <h3 className="text-lg font-bold">書き終わった人</h3>
                    <ul>
                        {room?.participants.map((participant) => {
                            if (participant.hasSubmitted) {
                                return (
                                    <li key={`${participant.id}_1`}>
                                        {participant.name}
                                    </li>
                                )
                            }
                        })}
                    </ul>
                    <Button onClick={handleFinishAnswer}>回答を終了</Button>
                </div>
            </> : <></>}
            {room?.status == "reviewing" ? <>
                <h1 className="text-center text-2xl my-4">お題 {room?.currentTopic}</h1>
                <div className="flex gap-4">
                    {room.participants.map((participant) => (
                        <div key={participant.id} className="">
                            <h4>{participant.name}</h4>
                            {participant.answer && (
                                <Image width={480} height={270} src={participant.answer} alt={`${participant.name}の回答`} className="border-2 rounded-md" />
                            )}
                        </div>
                    ))}
                </div>
                <div className="flex place-content-center gap-x-4">
                    <Button onClick={handleComplete}>揃った！</Button>
                    <Button onClick={handleNext}>揃わず...</Button>
                </div>
            </> : <></>}
        </>
    )
}