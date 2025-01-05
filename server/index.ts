import { serve } from "https://deno.land/std@0.140.0/http/server.ts";
import { Server } from "https://deno.land/x/socket_io@0.2.0/mod.ts";
import { getRandomTopic } from "./topics.ts";

const io = new Server({
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});

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
const map = new Map();

let gameState: GameState = {
    participants: map,
    currentRound: 0,
    completedRounds: 0,
    status: "waiting",
};

io.on("connection", (socket) => {
    socket.on("joinRoom", ({ joinName }: { joinName: string }) => {
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
                    participants: map,
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

await serve(io.handler(), {
    port: 8000,
});
