import React, { useMemo, useRef } from "react";
import * as d3 from "d3";
import styles from "./pie-chart.module.css";


type DataItem = {
    clusterLabel: string;
    value: number;
};

const MARGIN_X = 150;
const MARGIN_Y = 50;
const INFLEXION_PADDING = 1; // space between donut and label inflexion point

const colors = [
    "#f3f5f7",
    "#ffffff",
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

const PieChart = ({ width, height, clusterData, documentCountPerCluster, filteredDocumentCount }) => {
    const ref = useRef(null);

    let data: DataItem[] = [];
    // console.log(clusterDataTwo)
    // for (const cluster in clusterDataTwo) {

    //     console.log(clusterDataTwo[cluster])
    // }

    for (const cluster in clusterData) {
        const value = clusterData[cluster];
        if (parseInt(cluster) === 0) {
            data.push({
                clusterLabel: "Unassigned",
                // value: value.length - clusterDataTwo[cluster],
                value: value.length
            });
            let temp: number = 0;
            documentCountPerCluster.slice(1).map((count, index) => {
                temp += count;
            });
            // setNumberOfFilteredDocuments(temp)
            data.push({
                clusterLabel: "Filtered",
                value: temp,
            })
        }
        else {
            data.push({
                clusterLabel: "Cluster: " + cluster,
                // value: value.length - clusterDataTwo[cluster],
                value: value.length - documentCountPerCluster[cluster],
            });
        }
    }


    // data.push({
    //     clusterLabel: "Filtered Documents",
    //     value: filteredDocumentCount,
    // })

    const radius = Math.min(width - 2 * MARGIN_X, height - 2 * MARGIN_Y) / 2;

    const pie = useMemo(() => {
        const pieGenerator = d3.pie<any, DataItem>().value((d) => d.value);
        return pieGenerator(data);
    }, [data]);

    const arcGenerator = d3.arc();

    const shapes = pie.map((grp, i) => {
        // First arc is for the Pie
        const sliceInfo = {
            innerRadius: 0,
            outerRadius: radius,
            startAngle: grp.startAngle,
            endAngle: grp.endAngle,
        };
        const centroid = arcGenerator.centroid(sliceInfo);
        const slicePath = arcGenerator(sliceInfo);

        // Second arc is for the legend inflexion point
        const inflexionInfo = {
            innerRadius: radius + INFLEXION_PADDING,
            outerRadius: radius + INFLEXION_PADDING,
            startAngle: grp.startAngle,
            endAngle: grp.endAngle,
        };
        const inflexionPoint = arcGenerator.centroid(inflexionInfo);

        const isRightLabel = inflexionPoint[0] > 0;
        const labelPosX = inflexionPoint[0] + 15 * (isRightLabel ? 1 : -1);
        const textAnchor = isRightLabel ? "start" : "end";
        const label = grp.data.clusterLabel + " (" + grp.value + ")";

        if (i === 1) {
            return (
                data[1].value !== 0 ? (
                    < g
                        key={i}
                        className={styles.slice}
                        onMouseEnter={() => {
                            if (ref.current) {
                                (ref.current as HTMLElement).classList.add(styles.hasHighlight);
                            }
                        }}
                        onMouseLeave={() => {
                            if (ref.current) {
                                (ref.current as HTMLElement).classList.remove(styles.hasHighlight);
                            }
                        }}
                    >
                        <path d={slicePath!} fill={colors[i]} />
                        <circle cx={centroid[0]} cy={centroid[1]} r={2} />
                        <line
                            x1={centroid[0]}
                            y1={centroid[1]}
                            x2={inflexionPoint[0]}
                            y2={inflexionPoint[1]}
                            stroke={"black"}
                            fill={"black"}
                        />
                        <line
                            x1={inflexionPoint[0]}
                            y1={inflexionPoint[1]}
                            x2={labelPosX}
                            y2={inflexionPoint[1]}
                            stroke={"black"}
                            fill={"black"}
                        />

                        <text
                            x={labelPosX + (isRightLabel ? 2 : -2)}
                            y={inflexionPoint[1]}
                            textAnchor={textAnchor}
                            dominantBaseline="middle"
                            fontSize={13}
                            className="font-bold italic text-blue-600"
                        >
                            {label}
                        </text>
                    </g >
                ) : <></>
            );
        }
        else if (i === 0) {
            return (
                data[0].value !== 0 ? (
                    < g
                        key={i}
                        className={styles.slice}
                        onMouseEnter={() => {
                            if (ref.current) {
                                (ref.current as HTMLElement).classList.add(styles.hasHighlight);
                            }
                        }}
                        onMouseLeave={() => {
                            if (ref.current) {
                                (ref.current as HTMLElement).classList.remove(styles.hasHighlight);
                            }
                        }}
                    >
                        <path d={slicePath!} fill={colors[i]} />
                        <circle cx={centroid[0]} cy={centroid[1]} r={2} />
                        <line
                            x1={centroid[0]}
                            y1={centroid[1]}
                            x2={inflexionPoint[0]}
                            y2={inflexionPoint[1]}
                            stroke={"black"}
                            fill={"black"}
                        />
                        <line
                            x1={inflexionPoint[0]}
                            y1={inflexionPoint[1]}
                            x2={labelPosX}
                            y2={inflexionPoint[1]}
                            stroke={"black"}
                            fill={"black"}
                        />

                        <text
                            x={labelPosX + (isRightLabel ? 2 : -2)}
                            y={inflexionPoint[1]}
                            textAnchor={textAnchor}
                            dominantBaseline="middle"
                            fontSize={13}
                            className="font-bold italic text-blue-600"
                        >
                            {label}
                        </text>
                    </g >
                ) : <></>
            )
        }
        else {
            return (
                ((data[i].value) !== 0) ? (
                    < g
                        key={i}
                        className={styles.slice}
                        onMouseEnter={() => {
                            if (ref.current) {
                                (ref.current as HTMLElement).classList.add(styles.hasHighlight);
                            }
                        }}
                        onMouseLeave={() => {
                            if (ref.current) {
                                (ref.current as HTMLElement).classList.remove(styles.hasHighlight);
                            }
                        }}
                    >
                        <path d={slicePath!} fill={colors[i]} />
                        <circle cx={centroid[0]} cy={centroid[1]} r={2} />
                        <line
                            x1={centroid[0]}
                            y1={centroid[1]}
                            x2={inflexionPoint[0]}
                            y2={inflexionPoint[1]}
                            stroke={"black"}
                            fill={"black"}
                        />
                        <line
                            x1={inflexionPoint[0]}
                            y1={inflexionPoint[1]}
                            x2={labelPosX}
                            y2={inflexionPoint[1]}
                            stroke={"black"}
                            fill={"black"}
                        />

                        <text
                            x={labelPosX + (isRightLabel ? 2 : -2)}
                            y={inflexionPoint[1]}
                            textAnchor={textAnchor}
                            dominantBaseline="middle"
                            fontSize={13}
                            className="font-bold italic text-blue-600"
                        >
                            {label}
                        </text>
                    </g >
                ) : <></>
            );
        }

    });

    return (
        <svg width={width} height={height} style={{ display: "inline-block" }}>
            <g
                transform={`translate(${width / 2}, ${height / 2})`}
                className={styles.container}
                ref={ref}
            >
                {shapes}
            </g>
        </svg>
    );
};

export default PieChart;