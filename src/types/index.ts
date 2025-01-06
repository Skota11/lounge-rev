export interface Room {
    participants: Participant[];
    currentTopic: string | null;
    currentRound: number;
    completedRounds: number;
    status: "waiting" | "playing" | "reviewing" | "finished";
}

export interface Participant {
    id: string;
    name: string;
    hasSubmitted?: boolean;
    answer?: string; // Base64形式の描画データ
}
