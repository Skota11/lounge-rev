import Button from "@mui/material/Button";
import { useRef } from "react";
import { useSocket } from "./hooks/useSocket";

export function Join({ onJoin }: { onJoin: () => void }) {
    const inputRef = useRef<HTMLInputElement>(null);
    const socket = useSocket();

    return (
        <div className="max-w-lg p-4 mx-auto">
            <h1 className="text-center text-2xl my-8">部屋に参加</h1>
            <div className="flex place-content-center gap-x-4">
                <input
                    ref={inputRef}
                    className="border-2 py-3 px-4 border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                    placeholder="参加する名前"
                />
                <Button
                    onClick={() => {
                        const joinName = inputRef.current?.value;
                        if (!joinName) {
                            alert("名前を入力してください");
                            return;
                        }
                        socket.emit("joinRoom", { joinName });
                        onJoin();
                    }}
                    variant="outlined"
                >
                    参加
                </Button>
            </div>
        </div>
    );
}
