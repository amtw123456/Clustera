import { index } from "d3";
import styles from "./tooltip.module.css";
import { InteractionData } from "./types";
import React, { useState } from 'react';

type TooltipProps = {
    interactionData: InteractionData | undefined;
};

export const Tooltip = ({ interactionData }: TooltipProps) => {
    if (!interactionData) {
        return null;
    }

    const { xPos, yPos, name, color } = interactionData;
    console.log(interactionData)

    return (
        <div
            className={styles.tooltip}
            style={{
                left: xPos,
                top: yPos,
            }}
        >
            <b className={styles.title}>{name}</b>

            <div className={styles.topHalfContainer} style={{ borderColor: color }}>
                <div className={styles.row}>
                    <div className="flex-col flex justify-center mb-10">
                        {
                            interactionData.documentInformation[0].map((topicDistribution, index) => (
                                <div className="flex flex-row">
                                    <div>
                                        {(topicDistribution * 100).toFixed(2)}%
                                    </div>
                                    <div>
                                        {
                                            interactionData.topicsLabel[index] === null ? (
                                                <div className="font-bold italic ml-1">Cluster {index + 1}</div>
                                            ) :
                                                <div className="font-bold italic ml-1">{interactionData.topicsLabel[index]} [Cluster {index + 1}]</div>
                                        }
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                    <b></b>
                </div>
            </div>

            <div className={styles.separator} />

            <div className={styles.row}>
                <div>
                    {
                        interactionData.documentInformation[2] === 0 ? (
                            <div className="font-bold italic ml-1">Unclustered</div>
                        ) : interactionData.topicsLabel[interactionData.documentInformation[2]] === null ?
                            (
                                <div className="font-bold italic ml-1">Cluster {interactionData.documentInformation[2]}</div>
                            ) : (
                                <div className="font-bold italic ml-1">{interactionData.topicsLabel[interactionData.documentInformation[2]]} [Cluster {interactionData.documentInformation[2]}]</div>
                            )
                    }
                </div>
                {/* <b>{Math.round(size * 100) / 100}</b> */}
            </div>
        </div>
    );
};
