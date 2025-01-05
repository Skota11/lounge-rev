import type { Room } from ".";

interface C2S {
    joinRoom: [{ joinName: string }];
    GameStart: [];
    submitAnswer: [{ answer: string }];
    finishAnswer: [];
    complete: [];
    next: [];
}
export type ClientToServer = { [K in keyof C2S]: (...args: C2S[K]) => void };
// export interface ClientToServer {
//     joinRoom: (arg: { joinName: string }) => void;
//     GameStart: () => void;
//     submitAnswer: (arg: { answer: string }) => void;
//     finishAnswer: () => void;
//     complete: () => void;
// }
export interface ServerToClient {
    roomUpdate: (arg: Room) => void;
}
