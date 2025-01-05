// @ts-expect-error deno integration
import { serve } from "https://deno.land/std@0.140.0/http/server.ts";

// @ts-expect-error deno integration
import { Server } from "https://deno.land/x/socket_io@0.2.0/mod.ts";
import type { ClientToServer, ServerToClient } from "../src/types/socketio.ts";
// @ts-expect-error deno integration
import { getRandomTopic } from "./topics.ts";

type MyServer = import("socket.io").Server<ClientToServer, ServerToClient>;

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
const io: MyServer = new Server({
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
}) as any;

interface GameState {
    participants: Map<
        string,
        {
            name: string;
            hasSubmitted?: boolean;
            answer?: string;
        }
    >;
    currentTopic?: string;
    currentRound: number;
    completedRounds: number;
    status: "waiting" | "playing" | "reviewing" | "finished";
}

let gameState: GameState = {
    participants: new Map(),
    currentRound: 0,
    completedRounds: 0,
    status: "waiting",
};

io.on("connection", (socket) => {
    socket.on("joinRoom", ({ joinName }) => {
        gameState.participants.set(socket.id, {
            name: joinName,
        });
        io.emit("roomUpdate", getRoomState());
        console.log(gameState);
    });
    socket.on("GameStart", () => {
        gameState.status = "playing";
        gameState.currentTopic = getRandomTopic();
        gameState.currentRound++;
        io.emit("roomUpdate", getRoomState());
    });
    socket.on("submitAnswer", ({ answer }: { answer: string }) => {
        const participant = gameState.participants.get(socket.id);
        if (!participant) return;
        participant.hasSubmitted = true;
        participant.answer = answer;
        io.emit("roomUpdate", getRoomState());
    });
    socket.on("finishAnswer", () => {
        gameState.status = "reviewing";
        io.emit("roomUpdate", getRoomState());
    });
    socket.on("complete", () => {
        gameState.status = "playing";
        gameState.currentTopic = getRandomTopic();
        gameState.currentRound++;
        gameState.completedRounds++;
        gameState.participants.forEach((p) => {
            p.hasSubmitted = false;
            p.answer = undefined;
        });
        io.emit("roomUpdate", getRoomState());
    });
    socket.on("next", () => {
        gameState.status = "playing";
        gameState.currentTopic = getRandomTopic();
        gameState.currentRound++;
        gameState.participants.forEach((p) => {
            p.hasSubmitted = false;
            p.answer = undefined;
        });
        io.emit("roomUpdate", getRoomState());
    });

    socket.on("disconnect", () => {
        if (gameState.participants.has(socket.id)) {
            gameState.participants.delete(socket.id);
            if (gameState.participants.size === 0) {
                gameState = {
                    participants: gameState.participants,
                    currentRound: 0,
                    completedRounds: 0,
                    status: "waiting",
                };
            } else {
                io.emit("roomUpdate", getRoomState());
            }
        }
    });
});

//replacer
function getRoomState() {
    const room = gameState;
    return {
        ...room,
        participants: Array.from(room.participants.entries()).map(
            ([id, data]) => ({
                id,
                ...data,
            })
        ),
    };
}
// @ts-expect-error deno integration
// eslint-disable-next-line @typescript-eslint/no-unsafe-call
await serve(io.handler(), {
    port: 8000,
});
