import type { Room } from "@/types";
import { Button } from "@mui/material";
import { useSocket } from "../hooks/useSocket";

export default function Waiting({ room }: { room: Room }) {
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
