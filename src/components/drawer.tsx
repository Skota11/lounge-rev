"use client";

import { useCallback, useRef, useState } from "react";

import type Konva from "konva";
import { Layer, Line, Stage } from "react-konva";

import IconButton from "@mui/material/IconButton";

import { Button } from "@mui/material";
import { FaMagic, FaUndo } from "react-icons/fa";
import { LuPencil } from "react-icons/lu";

interface DrawingCanvasProps {
    onSubmit: (imageData: string) => void;
}
type Line = {
    tool: "pen" | "eraser";
    points: number[];
    color: string;
    strokeWidth: number;
};

export default function FreeDrawing({ onSubmit }: DrawingCanvasProps) {
    const tool = "pen";
    const [lines, setLines] = useState<Line[]>([]);
    const isDrawing = useRef(false);
    //ref
    const stageRef = useRef<Konva.Stage>(null);

    const handleDrawing = useCallback((e: Konva.KonvaEventObject<Event>) => {
        const position = e.target.getStage()!.getPointerPosition()!;
        isDrawing.current = true;
        setLines((prevLines) => [
            ...prevLines,
            {
                tool,
                points: [position.x, position.y],
                color: "#333",
                strokeWidth: 2,
            },
        ]);
    }, []);

    const handleMouseMove = useCallback((e: Konva.KonvaEventObject<Event>) => {
        if (!isDrawing.current) {
            return;
        }
        const position = e.target.getStage()!.getPointerPosition()!;
        setLines((prevLines) => {
            const lastLine = prevLines[prevLines.length - 1];
            const newLine = {
                ...lastLine,
                points: [...lastLine.points, position.x, position.y],
            };
            return [...prevLines.slice(0, -1), newLine];
        });
    }, []);

    const handleDrawEnd = useCallback(() => {
        isDrawing.current = false;
    }, []);

    const handleTouchStart = useCallback(
        (e: Konva.KonvaEventObject<Event>) => {
            e.evt.preventDefault();
            handleDrawing(e);
        },
        [handleDrawing]
    );

    const handleTouchMove = useCallback(
        (e: Konva.KonvaEventObject<TouchEvent>) => {
            e.evt.preventDefault();
            handleMouseMove(e);
        },
        [handleMouseMove]
    );

    const handleTouchEnd = useCallback(
        (e: Konva.KonvaEventObject<TouchEvent>) => {
            e.evt.preventDefault();
            handleDrawEnd();
        },
        [handleDrawEnd]
    );

    const handleResetCanvas = useCallback(() => {
        setLines([]);
    }, []);

    const handleUndo = useCallback(() => {
        setLines((prevLines) => prevLines.slice(0, prevLines.length - 1));
    }, []);

    const handleHand = useCallback(() => {
        if (stageRef.current) {
            onSubmit(stageRef.current.toCanvas().toDataURL());
        }
    }, [onSubmit]);

    return (
        <>
            <div className="flex place-content-center ">
                <Stage
                    width={480}
                    height={270}
                    onMouseDown={handleDrawing}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleDrawEnd}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                    ref={stageRef}
                    className="border-2 rounded-md bg-white"
                >
                    <Layer>
                        {lines.map((line, i) => (
                            <Line
                                key={i}
                                points={line.points}
                                stroke={line.color}
                                strokeWidth={line.strokeWidth}
                                tension={0.5}
                                lineCap="round"
                                lineJoin="round"
                                globalCompositeOperation={
                                    line.tool === "eraser"
                                        ? "destination-out"
                                        : "source-over"
                                }
                            />
                        ))}
                    </Layer>
                </Stage>
            </div>
            <div className="flex place-content-center items-center">
                <div className="bg-white inline-block rounded-full p-2 m-4">
                    <div className="flex place-content-center">
                        <IconButton
                            color={tool === "pen" ? "primary" : "default"}
                        >
                            <LuPencil />
                        </IconButton>
                        <IconButton onClick={handleResetCanvas}>
                            <FaMagic />
                        </IconButton>
                        <IconButton onClick={handleUndo}>
                            <FaUndo />
                        </IconButton>
                    </div>
                </div>
                <Button onClick={handleHand} variant="outlined">
                    回答
                </Button>
            </div>
            <p className="text-center">最後に回答したものが送信されます</p>
        </>
    );
}
