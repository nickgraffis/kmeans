const math = require('matematik');

// Method for comparing arrays (because JavaScript doesn't provide this for some reason)
Array.prototype.equals = function (array) {
    // if the other array is a falsy value, return
    if (!array)
        return false;

    // compare lengths - can save a lot of time
    if (this.length != array.length)
        return false;

    for (var i = 0, l=this.length; i < l; i++) {
        // Check if we have nested arrays
        if (this[i] instanceof Array && array[i] instanceof Array) {
            // recurse into the nested arrays
            if (!this[i].equals(array[i]))
                return false;
        }
        else if (this[i] != array[i]) {
            // Warning - two different object instances will never be equal: {x:20} != {x:20}
            return false;
        }
    }
    return true;
};


// Hide method from for-in loops
Object.defineProperty(Array.prototype, 'equals', {enumerable: false});

/**
* Generates a random integer in the closed interval specified by a and b
* @param {Number} a - lower bound
* @param {Number} b - upper bound
* @return {Number} randomInt - random integer generated
*/
function randomIntBetween(a, b) {
    return Math.floor(Math.random() * (b - a + 1)) + a;
}

/**
* Initialises the centroids for the k-means algorithm
* @param {Array} data - data set
* @param {Number} k - number of clusters/centroids
* @return {Array} centroids - array of centroid vectors
*/
function initialiseCentroidsRandomly(data, k) {
    var ranges = math.rangesOf(data);
    var centroids = [];
    for (let i = 0; i < k; i++) {
        var centroid = [];
        for (var r in ranges) {
            centroid.push(randomIntBetween(ranges[r].min, ranges[r].max));
        }
        centroids.push(centroid);
    }
    return centroids;
}

/**
* Attributes data points to the nearest centroid's cluster
* @param {Array} data - data set
* @param {Array} centroids - array of centroid vectors
* @return {Array} clusters - array of clusters
*/
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

/**
* Calculates the new vectors of the centroids based on their respective clusters
* @param {Array} clusters - array of clusters
* @return {Array} centroids - new centroid vectors
*/
function getNewCentroids(clusters) {
    var centroids = [];
    clusters.forEach(function (cluster) {
        centroids.push(math.meanPoint(cluster));
    });
    return centroids;
}

/**
* Performs k-means clustering on a data set
* @param {Array} data - data set
* @param {Array} k - number of clusters for data points to be partitioned into
* @return {Array} clusters - array of clusters (each containing an array of vectors representing a data point)
*/
function kMeans(data, k) {
    var centroids;
    var clusters;
    var oldClusters;
    var converged = false;
    const iterationLimit = 500;
    var iterations = 0;

    // STEP ONE: Initialise centroids
    centroids = initialiseCentroidsRandomly(data, k);

    while (!converged) {
        // console.log('iterated.');
        iterations += 1;
        // STEP TWO: Cluster data points according to nearest centroid (assignment step)
        oldClusters = clusters;
        clusters = clusterDataPoints(data, centroids);

        // Check for empty clusters. If so, just retry!
        if (clusters.some(x => x.length == 0)) {
            // console.log('Empty clusters found. Restarting k-means.');
            return kMeans(data, k);
        }

        // console.log(iterations, iterationLimit);
        if (clusters.equals(oldClusters) || iterations >= iterationLimit) {
            converged = true;
        }

        // STEP THREE: Set centroids to mean point of points belonging to their respective clusters (update step)
        centroids = getNewCentroids(clusters);
    }
    // console.log(clusters);
    return clusters;
}

module.exports = {
    kMeans: kMeans
};
