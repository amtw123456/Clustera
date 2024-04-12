export type DataItem = {
    documentTopicDistribution: [];
    name: string;
    x: number;
    y: number;
    size: number;
    color: string;
    annotation?: "top" | "right" | "left" | "bottom";
};

export type ScatterplotProps = {
    width: number;
    height: number;
    noOfClusters: number;
    reducedData: [];
    clusterLabel: [];
    documetsData: Object[]
};

// Information needed to build the tooltip
export type InteractionData = DataItem & {
    xPos: number;
    yPos: number;
};
