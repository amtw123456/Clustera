import React, { useState, useContext, useEffect } from 'react';
import * as d3 from "d3";
import { InteractionData, ScatterplotProps, DataItem } from "./types";
import { AppContext } from '../../providers/AppState.jsx';
import { Axes } from "./Axes";
import styles from "./scatterplot.module.css";
import { Tooltip } from "./Tooltip";


const Scatterplot = ({ width, height, reducedData, clusterLabel, documetsData, noOfClusters, documentTopicDistributionThreshold, topicsGeneratedLabel }: ScatterplotProps) => {
    // Sort the data: bigger squares must appear at the bottom
    const colors = [
        "#e0ac2b", // Orange
        "#e85252", // Red
        "#6689c6", // Blue
        "#9a6fb0", // Purple
        "#a53253", // Dark red
        "#69b3a2", // Light blue
        "#ffc107", // Yellow
        "#3f51b5", // Indigo
        "#43a047", // Green
        "#f9845e", // Light orange
        "#d81b60", // Dark pink
        "#738678", // Dark green
        "#8d6e63", // Brown
        "#4dd0e1", // Turquoise
        "#ff6e40", // Dark orange
        "#ffeb3b", // Amber
        "#4caf50", // Light green
        "#ab47bc", // Dark purple
        "#03a9f4", // Light blue
        "#9c27b0", // Dark violet
        "#9e9d24", // Olive
        "#ef5350", // Coral
        "#4db6ac", // Teal
        "#7e57c2", // Light purple
        "#f06292", // Pink
        "#4caf50", // Green
        "#e91e63", // Pink
        "#cddc39", // Lime
        "#00bcd4", // Cyan
        "#673ab7", // Deep purple
        "#009688", // Dark cyan
        "#8bc34a", // Lime green
        "#607d8b", // Blue grey
        "#795548", // Brown
        "#ffcdd2", // Light pink
        "#9fa8da", // Light indigo
        "#fff176", // Light yellow
        "#ffcc80", // Light orange
        "#a5d6a7", // Light green
        "#90a4ae", // Blue grey
        "#bcaaa4", // Brown
        "#d7ccc8", // Light brown
        "#f8bbd0", // Light pink
        "#e1bee7", // Light purple
        "#b2dfdb", // Light cyan
        "#c8e6c9", // Light green
        "#ffecb3", // Light amber
        "#ffe0b2", // Light orange
        "#ffccbc", // Light pink
    ];


    var maxXScale = 0;
    var maxYScale = 0;

    var minXScale = 0;
    var minYScale = 0;

    let data: DataItem[] = [];

    reducedData.forEach((item, index) => {

        if ((documetsData[index] as any).includeToClusterBool) {
            data.push({
                name: "Document: " + index,
                documentInformation: [(documetsData[index] as any).documentTopicDistribution, (documetsData[index] as any).clusterLabel, (documetsData[index] as any).clusterId],
                topicsLabel: topicsGeneratedLabel,
                x: parseFloat(item[0]),
                y: parseFloat(item[1]),
                size: 1,
                color: colors[clusterLabel[index]]
            });
        }

        if (maxXScale < parseFloat(item[0])) {
            maxXScale = parseFloat(item[0])
        }

        if (maxYScale < parseFloat(item[1])) {
            maxYScale = parseFloat(item[1])
        }

        if (minXScale > parseFloat(item[0])) {
            minXScale = parseFloat(item[0])
        }

        if (minYScale > parseFloat(item[1])) {
            minYScale = parseFloat(item[1])
        }
    })

    const sortedData = data.sort((a, b) => b.size - a.size);
    // State
    const [interactionData, setInteractionData] = useState<InteractionData>();

    // This part of the code is where the range of the scatterplot will be found
    const xScale = d3.scaleLinear().domain([minXScale + (minXScale / 2), maxXScale + (maxXScale / 2)]).range([0, width - 250]);
    const yScale = d3.scaleLinear().domain([minYScale + (minYScale / 2), maxYScale + (maxYScale / 2)]).range([height - 50, 0]);

    const sizeScale = d3.scaleSqrt().domain([0, 16]).range([3, 40]);

    const scatterPlots = sortedData.map((d, i) => {
        const size = sizeScale(d.size);

        const xPos = xScale(d.x) - size / 2;
        const yPos = yScale(d.y) - size / 2;

        const isDimmed = interactionData && interactionData.color !== d.color;
        const className = isDimmed
            ? styles.scatterPlotsCircle + " " + styles.dimmed
            : styles.scatterPlotsCircle;

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
                <circle
                    key={i}
                    r={7}
                    cx={xPos}
                    cy={yPos}
                    className={className}
                    stroke={"black"}
                    fill={d.color}
                    strokeWidth={1}
                />
            </g>
        );
    });

    const scatterplotLegends = [...Array(noOfClusters)].map((x, i) => {
        return (
            <g key={i}>  {/* Add a unique key for each legend */}
                <circle
                    r={4}
                    cx={1320}
                    cy={19 * (i + 1) - 3}
                    fill={colors[i]}
                />
                {
                    topicsGeneratedLabel[i] === null ? (
                        <text
                            x={1340}
                            y={19 * (i + 1) - 2}
                            fontSize={11}
                            fontWeight={500}
                            dominantBaseline="middle" // vertical alignment
                        >
                            Cluster {i + 1}
                        </text>
                    ) :
                        <text
                            x={1340}
                            y={19 * (i + 1) - 2}
                            fontSize={11}
                            fontWeight={500}
                            dominantBaseline="middle" // vertical alignment
                        >
                            {topicsGeneratedLabel[i]} [Cluster {i + 1}]
                        </text>
                }
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
        <div style={{ position: "relative" }} >
            <svg width={width} height={height} className='mt-3'>
                <g className="ml-5">
                    {annotations}
                    {scatterplotLegends}

                    <Axes
                        x={xScale(0.4)}
                        y={yScale(0.4)}
                        width={width + 100}
                        height={height + 100}
                        rangex1={minXScale}
                        rangex2={maxXScale}
                        rangey1={minYScale}
                        rangey2={maxYScale}

                    />
                    {scatterPlots}

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
        </div >
    );
};

export default Scatterplot;
