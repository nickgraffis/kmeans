require('@nickgraffis/array.equals');
const math = require('matematik');

module.exports = {
    kMeans: kMeans,
};

function centroidInit(data, k) {
    var ranges = math.rangesOf(data);
    var centroids = [];
    for (let i = 0; i < k; i++) {
        var centroid = [];
        for (var r in ranges) {
            centroid.push(math.randomIntBetween(ranges[r].min, ranges[r].max));
        }
        centroids.push(centroid);
    }
    return centroids;
}

function clusterDataPoints(data, centroids) {
    var clusters = [];
    centroids.forEach(function () {
        clusters.push([]);
    });
    data.forEach(function (point) {
        var nearestCentroid = centroids[0];
        centroids.forEach(function (centroid) {
            if (math.euclideanDistance(point, centroid) < math.euclideanDistance(point, nearestCentroid)) {
                nearestCentroid = centroid;
            }
        });
        clusters[centroids.indexOf(nearestCentroid)].push(point);
    });
    return clusters;
}

function newCentroids(clusters) {
    var centroids = [];
    clusters.forEach(function (cluster) {
        centroids.push(math.meanDataPoint(cluster));
    });
    return centroids;
}

function kMeans(data, k) {
    var centroids;
    var clusters;
    var oldClusters;
    var converged = false;
    const iterationLimit = 500;
    var iterations = 0;

    // STEP ONE: Initialise centroids
    centroids = centroidInit(data, k);

    while (!converged) {
        console.log('iterated.');
        iterations += 1;
        // STEP TWO: Cluster data points according to nearest centroid (assignment step)
        oldClusters = clusters;
        clusters = clusterDataPoints(data, centroids);

        // Check for empty clusters. If so, just retry!
        if (clusters.some(x => x.length == 0)) {
            console.log('Empty clusters found. Restarting k-means.');
            return kMeans(data, k);
        }

        console.log(iterations, iterationLimit);
        if (clusters.equals(oldClusters) || iterations >= iterationLimit) {
            converged = true;
        }

        // STEP THREE: Set centroids to mean point of points belonging to their respective clusters (update step)
        centroids = newCentroids(clusters);
    }
    return clusters;
}