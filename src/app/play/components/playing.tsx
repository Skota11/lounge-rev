import Drawer from "@/components/drawer";
import type { Room } from "@/types";
import { Button } from "@mui/material";
import { useSocket } from "../hooks/useSocket";

export default function Playing({ room }: { room: Room }) {
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
                お題 {room.currentTopic}
            </h1>
            <p className="text-center">
                {`${room.currentRound}ラウンド目 / ${room.completedRounds}回一致`}
            </p>
            <Drawer onSubmit={submitAnswer} />
            <div className="max-w-lg mx-auto p-4">
                <h3 className="text-lg font-bold">書き終わった人</h3>
                <ul className="my-4">
                    {room.participants.map((participant) => {
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
