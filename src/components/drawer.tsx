"use client";

import { useState, useRef } from "react";

import { Stage, Layer, Line } from "react-konva";
import Konva from "konva";

import IconButton from "@mui/material/IconButton";

import { LuPencil } from "react-icons/lu";
import { FaUndo, FaMagic } from "react-icons/fa";
import { Button } from "@mui/material";

interface DrawingCanvasProps {
    onSubmit: (imageData: string) => void;
}

const FreeDrawingComponent = ({ onSubmit }: DrawingCanvasProps) => {
    const tool = "pen";
    const [lines, setLines] = useState<any[]>([]);
    const isDrawing = useRef(false);
    //ref
    const stageRef = useRef<Konva.Stage>(null);

    const handleMouseDown = (e: any) => {
        isDrawing.current = true;
        const position = e.target.getStage().getPointerPosition();
        setLines([
            ...lines,
            {
                tool,
                points: [position.x, position.y],
                color: "#333",
                strokeWidth: 1,
            },
        ]);
    };

    const handleMouseMove = (e: any) => {
        if (!isDrawing.current) {
            return;
        }
        const position = e.target.getStage().getPointerPosition();
        let lastLine = lines[lines.length - 1];
        lastLine.points = lastLine.points.concat([position.x, position.y]);

        lines.splice(lines.length - 1, 1, lastLine);
        setLines(lines.concat());
    };
    const handleTouchStart = (e: any) => {
        e.evt.preventDefault();
        isDrawing.current = true;
        const position = e.target.getStage().getPointerPosition();
        setLines([
            ...lines,
            {
                tool,
                points: [position.x, position.y],
                color: "#333",
                strokeWidth: 1,
            },
        ]);
    };

    const handleTouchMove = (e: any) => {
        e.evt.preventDefault();
        if (!isDrawing.current) {
            return;
        }
        const point = e.target.getStage().getPointerPosition();
        const lastLine = lines[lines.length - 1];
        lastLine.points = lastLine.points.concat([point.x, point.y]);
        lines.splice(lines.length - 1, 1, lastLine);
        setLines([...lines]);
    };

    const handleTouchEnd = (e: any) => {
        e.evt.preventDefault();
        isDrawing.current = false;
    };

    const handleMouseUp = () => {
        isDrawing.current = false;
    };

    const onClickResetCanvas = () => {
        setLines([]);
    };

    const handleUndo = () => {
        setLines(lines.slice(0, lines.length - 1));
    };

    //me
    const handleHand = async () => {
        if (stageRef.current) {
            onSubmit(stageRef.current.toCanvas().toDataURL());
        }
    };

    return (
        <>
            <div className="flex place-content-center ">
                <Stage
                    width={480}
                    height={270}
                    onMouseDown={handleMouseDown}
                    onMousemove={handleMouseMove}
                    onMouseUp={handleMouseUp}
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
                        <IconButton onClick={onClickResetCanvas}>
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
};

export default FreeDrawingComponent;
