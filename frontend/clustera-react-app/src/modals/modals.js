export class Document {
    constructor(uDocument, pDocument, clusterLabel, topics, clusterId) {
        this.uDocument = uDocument
        this.pDocument = pDocument
        this.clusterId = clusterId;
        this.clusterLabel = clusterLabel;
        this.topics = topics;
    }
}