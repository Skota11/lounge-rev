"use client"

import Button from '@mui/material/Button';
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter()
  const handleCreateRoom = async () => {
    router.push(`/play`)
  }
  return (
    <>
      <h1 className="text-center text-lg">おわれまてん！(突貫工事)</h1>
      <div className="flex place-content-center my-4">
        <Button variant="contained" onClick={handleCreateRoom}>ゲームに参加</Button>
      </div>
    </>
  )
}