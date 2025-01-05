import type { Room } from ".";

// TODO: 実装で型のバリデーションを行わないと危険
interface C2S {
    joinRoom: [{ joinName: string }];
    GameStart: [];
    submitAnswer: [{ answer: string }];
    finishAnswer: [];
    complete: [];
    next: [];
}

export interface S2C {
    roomUpdate: [Room];
}

export type ClientToServer = { [K in keyof C2S]: (...args: C2S[K]) => void };
export type ServerToClient = { [K in keyof S2C]: (...args: S2C[K]) => void };
