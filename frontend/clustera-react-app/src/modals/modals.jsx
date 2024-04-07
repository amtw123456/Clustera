export class Document {
    constructor(uDocument, pDocument, clusterId, clusterLabel, topics, documentTopicDistribution, documentTokens) {
        this.uDocument = uDocument;
        this.pDocument = pDocument;
        this.clusterId = clusterId;
        this.clusterLabel = clusterLabel;
        this.documentTokens = documentTokens;
        this.documentTopicDistribution = documentTopicDistribution;
        this.topics = topics;
    }
}

export class Cluster {
    constructor(documentsIndex, clusterLabel, clusterId, clusterTopics) {
        this.documentsIndex = documentsIndex;
        this.clusterLabel = clusterLabel;
        this.clusterId = clusterId;
        this.clusterTopics = clusterTopics;
    }
}