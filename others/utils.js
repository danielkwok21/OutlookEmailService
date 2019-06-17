const fs = require('fs');
const ComparisonResult = require('../classes/ComparisonResult');

const Utils = {

    //log to local text file
    writeToFile: function(object, path){
        console.log('writing to file...')

        if(typeof object==='object'){
            fs.writeFileSync(path, JSON.stringify(object, null, '\t'), (err)=>{
                if(err){
                    console.log('Error: failed to write to '+path);
                }
            })
            
        }else{

            fs.writeFile(path, text, (err)=>{
                if(err){
                    console.log('Error: failed to write to '+path)
                }else{
                    console.log('Result is in '+path)
                }
            })

        }
    },

    //takes a wordObject and compares it to another String
    wordComparison: function(s1, s2){
        comparedTo = s1.toLowerCase().replace(/\s+/g, '');
        comparing = s2.toLowerCase().replace(/\s+/g, '');

        let similarityIndex = lavenshtein(comparedTo, comparing)

        //if index is less than benchmark, result = false
        const benchMark = 0.8;
        let result = true;

        if(similarityIndex<benchMark){
            result = false;
        }else{            
            // console.log(similarityIndex+'|'+comparedTo+'=='+comparing)
        }

        let comparisonResult = new ComparisonResult(comparedTo, comparing, result, similarityIndex)
        
        return comparisonResult;
        
        function lavenshtein(keyword, string){
            let costMatrix = []
        
            for(let ki=0 ;ki<keyword.length+1; ki++){
                costMatrix.push([])
                let ks = keyword.substr(0, ki)
        
                for(let si=0; si<string.length+1; si++){
        
                    let ss = string.substr(0, si)
        
                    if(ss.charAt(ss.length-1)===ks.charAt(ks.length-1)){
                        // if end chars are same
                        try{
                            costMatrix[ki].push(costMatrix[ki-1][si-1])
                        }catch(err){
                            costMatrix[ki].push(Utils.getMax(ss.length, ks.length))
                        }
                    }else{
                        try{
                            costMatrix[ki].push(Utils.getMin(costMatrix[ki][si-1], costMatrix[ki-1][si-1], costMatrix[ki-1][si])+1)
                        }catch(err){
                            costMatrix[ki].push(Utils.getMax(ss.length, ks.length))	
                        }
                    }
                }
            }
        
            let distance = costMatrix[keyword.length][string.length]
            let maxDistance = Utils.getMax(keyword.length, string.length)
            let score = 1 - distance/maxDistance
        
            // console.log({
            // 	costMatrix: costMatrix,
            // 	distance: distance,
            // 	maxDistance: maxDistance,
            // 	score: score
            // })
        
            return score
        }
    },
     
    getMin: function(a, b, c){
        if(a!==undefined&&b!==undefined&c!==undefined){
            min = a
            if(b<min){
                min = b
            }
            if(c<min){
                min = c
            }
            return min
        }else{
            throw err
        }
    },

    getMax: function(a, b){
        if(a!==undefined&&b!==undefined){
            return a>b?a:b
        }else{
            throw err
        }
    },

    removeOutlier: function(arr){
        if(arr.length>2){
            arr = arr.sort()		
            let IQ1 = getIQ(arr, 1)
            let IQ3 = getIQ(arr, 3)
            let IQR = IQ3 - IQ1
            let lowerLimit = IQ1 - IQR
            let upperLimit = IQ3 + IQR
    
            console.log({
                arr:arr,
                IQ1: IQ1,
                IQ3: IQ3,
                lowerLimit: lowerLimit,
                upperLimit: upperLimit
            })
    
            let newArr = arr.filter(a=>{
                return a>=lowerLimit && a<=upperLimit
            })
    
            return newArr
        }else{
            return arr
        }
    
        function getIQ(arr, range){
            if(!(arr.length%2)){
                // even num
                return (arr[(arr.length/4)*range-1]+arr[(arr.length/4)*range])/2
            }else{
                // odd num
                return arr[Math.ceil((arr.length/4)-1)*range]
            }
        }
    },

    getAve: function(arr){
        if(arr.length>0){
            return arr.reduce((t, d)=>{
                return t+=d
            }, 0)/arr.length
        }else{
            return 0
        }
    },

    getSD: function(arr){
        if(arr.length>0){
            let ave =  Utils.getAve(arr)
            let variance = arr.reduce((t, d)=>{
                return t+=Math.pow((d - ave), 2)
            }, 0)/arr.length
    
            return Math.sqrt(variance)
        }else{
            return 0
        }
    }
}

module.exports = Utils