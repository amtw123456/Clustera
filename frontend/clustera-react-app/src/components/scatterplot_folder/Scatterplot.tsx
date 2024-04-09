import React, { useState } from 'react';
import * as d3 from "d3";
import { InteractionData, ScatterplotProps, DataItem } from "./types";
import { Axes } from "./Axes";
import styles from "./scatterplot.module.css";
import { Tooltip } from "./Tooltip";


const Scatterplot = ({ width, height, reducedData, clusterLabel }: ScatterplotProps) => {
    console.log(reducedData)
    console.log(clusterLabel)
    // Sort the data: bigger squares must appear at the bottom

    const colors = [
        "#e0ac2b", // Orange
        "#e85252", // Red
        "#6689c6", // Blue
        "#9a6fb0", // Purple
        "#a53253", // Dark red
        "#69b3a2", // Light blue

        // New unique colors
        "#ffc107", // Yellow
        "#3f51b5", // Indigo
        "#43a047", // Green
        "#f9845e", // Light orange
        "#d81b60", // Dark pink
        "#738678", // Dark green
    ];

    let data: DataItem[] = [];
    reducedData.forEach((item, index) => {
        data.push({
            name: "Document: " + index,
            x: parseInt(item[0]),
            y: parseInt(item[1]),
            size: 1,
            color: colors[clusterLabel[index]]
        });
    })

    const sortedData = data.sort((a, b) => b.size - a.size);
    // State
    const [interactionData, setInteractionData] = useState<InteractionData>();

    // This part of the code is where the range of the scatterplot will be found
    const xScale = d3.scaleLinear().domain([-1000, 1000]).range([0, width]);
    const yScale = d3.scaleLinear().domain([-1000, 1000]).range([height, 0]);
    const sizeScale = d3.scaleSqrt().domain([0, 32]).range([3, 40]);

    // All squares, 1 per country
    const squares = sortedData.map((d, i) => {
        const size = sizeScale(d.size);

        const xPos = xScale(d.x) - size / 2;
        const yPos = yScale(d.y) - size / 2;

        const isDimmed = interactionData && interactionData.color !== d.color;
        const className = isDimmed
            ? styles.scatterplotSquare + " " + styles.dimmed
            : styles.scatterplotSquare;

        return (
            <g
                key={i}
                onMouseMove={() =>
                    setInteractionData({
                        xPos,
                        yPos,
                        ...d,
                    })
                }
                onMouseLeave={() => setInteractionData(undefined)}
            >
                {/* <rect
                    x={xPos}
                    y={yPos}
                    opacity={1}
                    fill={d.color}
                    width={size}
                    height={size}
                    className={className}
                /> */}
                <circle
                    key={i}
                    r={7}
                    cx={xPos}
                    cy={yPos}
                    className={className}
                    stroke={d.color}
                    fill={d.color}
                    strokeWidth={1}
                />
            </g>
        );
    });

    // Build the annotations (black rectangle and country name)
    // This is made separately, because it needs to appear on top of all colored rectangles
    const annotations = sortedData
        .filter((d) => d.annotation)
        .map((d, i) => {
            const size = sizeScale(d.size);

            const x = xScale(d.x); // position of the baricenter of the square
            const y = yScale(d.y);

            const xText =
                d.annotation === "left"
                    ? x - size / 2 - 5
                    : d.annotation === "right"
                        ? x + size / 2 + 5
                        : x;

            const yText =
                d.annotation === "top"
                    ? y - size / 2 - 7
                    : d.annotation === "bottom"
                        ? y + size / 2 + 7
                        : y;

            const isDimmed = interactionData && interactionData.color !== d.color;
            const className = isDimmed ? styles.dimmed : "";

            const textAnchor =
                d.annotation === "left"
                    ? "end"
                    : d.annotation === "right"
                        ? "start"
                        : "middle";

            return (
                <g key={i} className={className}>
                    <rect
                        x={x - size / 2}
                        y={y - size / 2}
                        opacity={1}
                        fill={"none"}
                        strokeWidth={1}
                        stroke={"black"}
                        width={size}
                        height={size}
                    />
                    <text
                        x={xText}
                        y={yText}
                        fontSize={12}
                        fontWeight={500}
                        textAnchor={textAnchor} // horizontal alignment
                        dominantBaseline={"middle"} // vertical alignment
                    >
                        {d.name}
                    </text>
                </g>
            );
        });

    return (
        <div style={{ position: "relative" }}>
            <svg width={width} height={height} shapeRendering={"crispEdges"}>
                <g>
                    <Axes
                        x={xScale(0.42)}
                        y={yScale(0.41)}
                        width={width + 100}
                        height={height + 100}
                    />
                    {squares}
                    {annotations}
                </g>
            </svg>
            <div
                style={{
                    position: "absolute",
                    width,
                    height,
                    top: 0,
                    left: 0,
                    pointerEvents: "none",
                }}
            >
                <Tooltip interactionData={interactionData} />
            </div>
        </div>
    );
};

export default Scatterplot;