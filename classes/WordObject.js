const crypto = require('crypto')
const utils = require('../../others/utils')

let WordObject = function(){
    
    // default constructor for creating WordObject from results.json
    this.init = function(string, vertices, key=""){

        this.string = string

        this.topLeft = new Coordinate(vertices[0].x, vertices[0].y)
        this.topRight = new Coordinate(vertices[1].x, vertices[1].y)
        this.bottomRight = new Coordinate(vertices[2].x, vertices[2].y)
        this.bottomLeft = new Coordinate(vertices[3].x, vertices[3].y)

        this.originalHeight = this.bottomRight.y - this.topRight.y
        this.originalWidth = this.bottomRight.x - this.bottomLeft.x
        
        this.centre = this.calculateCentre(this.topLeft.x, this.topLeft.y, this.bottomRight.x, this.bottomRight.y)
        
        this.key = key
        this.confidence = 0
        
        this.threshold = 0.5
        this.maxConfidence = 1

        this.id = this.generateId(this.centre.x, this.centre.y, this.string)

        this.neighbours = []
        this.infectedFrom = ''

        return this
    }

    // secondary constructor that deals with creating wordObject from combining wordObjects
    this.init2 = function(thisWord, anotherWord){
        this.string = thisWord.string.replace(' ', '') + anotherWord.string.replace(' ', '')

        this.topLeft = {
            x: getMin(thisWord.topLeft.x, anotherWord.topLeft.x),
            y: getMin(thisWord.topLeft.y, anotherWord.topLeft.y)
        }
        this.topRight = {
            x: getMax(thisWord.topRight.x, anotherWord.topRight.x),
            y: getMin(thisWord.topRight.y, anotherWord.topRight.y) 
        }
        this.bottomRight = {
            x: getMax(thisWord.bottomRight.x, anotherWord.bottomRight.x),
            y: getMax(thisWord.bottomRight.y, anotherWord.bottomRight.y) 
        }
        this.bottomLeft = {
            x: getMin(thisWord.bottomLeft.x, anotherWord.bottomLeft.x),
            y: getMax(thisWord.bottomLeft.y, anotherWord.bottomLeft.y)
        }
        
        this.originalHeight = this.bottomRight.y - this.topRight.y
        this.originalWidth = this.bottomRight.x - this.bottomLeft.x

        this.centre = this.calculateCentre(this.topLeft.x, this.topLeft.y, this.bottomRight.x, this.bottomRight.y)
        
        this.key = thisWord.key
        this.confidence = thisWord.confidence + anotherWord.confidence
        this.threshold = thisWord.threshold
        this.maxConfidence = thisWord.maxConfidence

        this.id = thisWord.generateId(this.centre, this.string)
        this.neighbours = thisWord.neighbours.concat(anotherWord.neighbours)

        return this

        function getMax(x, y){
            if(x>=y){
                return x
            }
            return y
        }

        function getMin(x, y){
            if(x>=y){
                return y
            }
            return x
        }
    }

    this.generateId = function(x, y, string){
        const secret = '420cookies'
    
        return crypto
        .createHmac('sha256', secret)
        .update(x.toString()+y.toString()+string)
        .digest('hex')
    }

    this.calculateCentre = function(x1, y1, x2, y2){
        return new Coordinate(Math.floor((x1+x2)/2), Math.floor((y1+y2)/2))  
    }

    this.addNeighbour = function(pos, wordObject){
        this.neighbours.push({
            position: pos,
            string: wordObject.string,
            key: wordObject.key,
            id: wordObject.id
        })        
    }

    this.setKey = function(key){
        if(key){
            this.key = key
            this.confidence = 0
        }else{           
            this.key=''
            this.confidence = this.maxConfidence
            this.id = this.generateId(this.centre.x, this.centre.y, this.string)
        }
    }

    this.vote = function(){
        this.confidence+=0.2
        if(this.confidence>1){
            this.confidence = 1
        }
        return this
    }
}

const Coordinate = function(x, y){
    this.x = x
    this.y = y

    return this
}

module.exports = WordObject