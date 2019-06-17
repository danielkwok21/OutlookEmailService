const ComparisonResult = function(compared, comparing, result, similarity){
    this.compared = compared;
    this.comparing = comparing;
    this.result = result;
    this.similarity = similarity;
}

module.exports = ComparisonResult