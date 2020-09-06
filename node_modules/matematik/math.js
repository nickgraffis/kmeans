module.exports = {
    euclideanDistance : euclideanDistance,
    rangeOf : rangeOf,
    rangesOf: rangesOf,
    meanDataPoint: meanDataPoint,
    mean: mean,
    randomIntBetween: randomIntBetween,
};

function euclideanDistance(a, b) {
	if (a.length != b.length) {
		throw "Cannot compare points that exist on planes of different dimensions!";
	}

	var sum = 0;

	for (let i = 0; i < a.length; i++) {
		pow = 1;
		for (let j = 0; j < 2; j++) {
			pow = pow * (b[i] - a[i]);
		}
		sum += pow;
	}

	return Math.sqrt(sum);
}

function rangeOf(data) {
	return data.reduce(function(total, current) {
		if (current < total.min) { total.min = current; }
		if (current > total.max) { total.max = current; }
		return total;
	}, {min: data[0], max: data[0]});
}

function rangesOf(data) {
	var ranges = [];
	for (let i = 0; i < data[0].length; i++) {
		ranges.push(rangeOf(data.map(x => x[i])));
	}
	return ranges;
}

function meanDataPoint(data) {
	var point = [];
	if (data.length != 0) {
		for (let i = 0; i < data[0].length; i++) {
			point.push(mean(data.map(x => x[i])));
		}
	}
	return point;
}

function mean(data) {
	return data.reduce((total, current) => total += current, 0) / data.length;
}

function randomIntBetween(a, b) {
    return Math.floor(Math.random() * (b - a + 1)) + a;
}