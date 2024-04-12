import React from 'react';

type AxesProps = {
    x: number;
    y: number;
    width: number;
    height: number;
    rangex1: number;
    rangey1: number;
    rangex2: number;
    rangey2: number;
};

export const Axes = ({ x, y, width, height, rangex1, rangey1, rangex2, rangey2 }: AxesProps) => {
    const averageRangeOfX = ((Math.abs(rangex1) + Math.abs(rangex2)) / 26)
    const averageRangeOfY = ((Math.abs(rangey1) + Math.abs(rangey2)) / 17)

    width = width - 250;

    return (
        <g>
            {/* vertical and horizontal lines */}
            <line stroke="currentColor" y2={height - 140} x1={45} x2={45} shapeRendering={"crispEdges"}></line>
            <line stroke="currentColor" x2={width - 95} x1={45}></line>
            <line stroke="currentColor" x1={0 + 45} x2={width - 95} y1={height - 140} y2={height - 140} shapeRendering={"crispEdges"}></line>
            <line stroke="currentColor" x1={width - 95} x2={width - 95} y1={0} y2={height - 140} shapeRendering={"crispEdges"}></line>

            {
                [...Array(29)].map((x, i) =>
                    <g>
                        <line stroke="gray" strokeWidth={0.2} x1={(i * 45) + 45} x2={(i * 45) + 45} y1={0} y2={height - 140} shapeRendering={"crispEdges"}></line>
                    </g>
                )
            }

            {
                [...Array(27)].map((x, i) =>
                    <text
                        x={i * (45) + 72}
                        y={height - 120}
                        fill="black"
                        fontSize={10}
                        dominantBaseline={"Auto"}
                    >
                        {(averageRangeOfX * i + rangex1).toFixed(2)}
                    </text>
                )
            }

            {
                [...Array(19)].map((x, i) =>
                    <g>
                        <line stroke="gray" strokeWidth={0.2} x1={0 + 45} x2={width - 95} y1={38 * i} y2={38 * i} shapeRendering={"crispEdges"}></line>
                    </g>
                )
            }

            {
                [...Array(18)].map((x, i) =>
                    <text
                        x={6}
                        y={38 * i + 39}
                        fill="black"
                        fontSize={10}
                        textRendering={"optimizeLegibility"}
                        dominantBaseline={"Auto"}
                    >
                        {(averageRangeOfY * i + rangey1).toFixed(2)}
                    </text>
                )
            }

            <text
                x={0}
                y={y - 15}
                fill="#ababab"
                fontSize={16}
                textRendering={"optimizeLegibility"}
                dominantBaseline={"Auto"}
            >
            </text>
            <text
                x={0}
                y={y - 37}
                fill="#ababab"
                fontSize={16}
                textRendering={"optimizeLegibility"}
                dominantBaseline={"Auto"}
            >
            </text>
        </g >
    );
};

