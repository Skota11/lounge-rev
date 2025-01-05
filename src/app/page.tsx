"use client";

import Button from "@mui/material/Button";
import { useRouter } from "next/navigation";
import ThemeButton from "@/components/changeThemeButton";

export default function Home() {
    const router = useRouter();
    const handleCreateRoom = async () => {
        router.push(`/play`);
    };
    return (
        <>
            <div className="max-w-lg mx-auto p-4">
                <h1 className="text-center text-2xl my-8">
                    おわれまてん！(ラウンジ)
                </h1>
                <div className="flex place-content-center my-4">
                    <Button variant="contained" onClick={handleCreateRoom}>
                        ゲームに参加
                    </Button>
                </div>
                <div className="max-w-lg m-auto">
                    <p>
                        ゲームを開始する前にホスト役を決めておくことをおすすめします
                    </p>
                    <p>
                        ※ホストでなくても、ゲームの開始や回答の終了をすることができます
                    </p>
                </div>
            </div>
            <ThemeButton />
        </>
    );
}
