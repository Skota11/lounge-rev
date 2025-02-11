"use client";

import type { ClientToServer, ServerToClient } from "@/types/socketio";
import { createContext, use, useEffect, useState } from "react";
import { io, type Socket } from "socket.io-client";
export type MySocket = Socket<ServerToClient, ClientToServer>;
const socketCtx = createContext<MySocket | null>(null);
export function SocketProvider({ children }: { children: React.ReactNode }) {
    const [socket, setSocket] = useState<MySocket | null>(null);

    useEffect(() => {
        setSocket(io(process.env.NEXT_PUBLIC_SOCKET_SERVER, { path: "/socket" }));
    }, []);
    if (socket !== null) {
        return (
            <socketCtx.Provider value={socket}>{children}</socketCtx.Provider>
        );
    }
    return null;
}

export function useSocket() {
    const socket = use(socketCtx);
    if (socket === null) {
        throw new Error("useSocket cannot be used outside of a SocketProvider");
    }
    return socket;
}
/**
 * Socket.ioのイベントをリッスンし、クリーンアップするフック
 * @param ev リッスンするイベント名
 * @param cb イベントリスナ
 */
export function useSocketOn<Ev extends keyof ServerToClient>(
    ev: Ev,
    cb: ServerToClient[Ev]
) {
    const socket = useSocket();
    useEffect(() => {
        // 型の解決方法が思いつかない
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-explicit-any
        socket.on(ev, cb as any);
        return () => {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-explicit-any
            socket.off(ev, cb as any);
        };
    }, [cb, ev, socket]);
}
