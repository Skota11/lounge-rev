import type { Room } from "@/types";
import Button from "@mui/material/Button";
import Image from "next/image";
import { useSocket } from "../hooks/useSocket";

export default function Reviewing({ room }: { room: Room }) {
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
                            {participant.answer ? (
                                <Image
                                    width={480}
                                    height={270}
                                    src={participant.answer}
                                    alt={`${participant.name}の回答`}
                                    className="border-2 rounded-md bg-white"
                                />
                            ) :
                                (<div>
                                    <p>回答なし</p>
                                </div>)}
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
