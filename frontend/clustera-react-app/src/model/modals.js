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