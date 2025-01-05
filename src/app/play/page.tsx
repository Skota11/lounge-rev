"use client";

import ThemeButton from "@/components/changeThemeButton";
import { Room } from "@/types";
import { useState } from "react";
import { Join } from "./components/join";
import Playing from "./components/playing";
import Reviewing from "./components/reviewing";
import Waiting from "./components/waiting";
import { useSocketOn } from "./hooks/useSocket";

function useRoom() {
    const [room, setRoom] = useState<Room | null>(null);
    //socket.io
    useSocketOn("roomUpdate", (updatedRoom) => {
        setRoom(updatedRoom);
    });

    return room;
}

export default function Home() {
    const [isJoined, setIsJoined] = useState(false);

    //game
    const room = useRoom();
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
