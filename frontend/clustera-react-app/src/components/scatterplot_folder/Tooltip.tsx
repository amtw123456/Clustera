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

    const { xPos, yPos, name, color, x, y, size } = interactionData;

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
                            interactionData.documentTopicDistribution.map((TopicDistribution, Index) => (
                                <div>
                                    {TopicDistribution * 100}
                                </div>
                            ))
                        }
                    </div>
                    <b></b>
                </div>
                <div className={styles.row}>
                    <span>================</span>
                    <b></b>
                </div>
            </div>

            <div className={styles.separator} />

            <div className={styles.row}>
                <span>
                    ============
                    <br />
                    =============
                </span>
                <b>{Math.round(size * 100) / 100}</b>
            </div>
        </div>
    );
};
