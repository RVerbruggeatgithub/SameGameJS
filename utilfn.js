/*
    Utility Functions
*/


/*
getRandomInt
Generate random int
int max
returns int between 0 and max
*/
function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }


/*
transpose
Pivot table function
Author Unknown
array a (2-dimensional array)
returns pivotted table
*/
function transpose(a) {
    return Object.keys(a[0]).map(function(c) {
        return a.map(function(r) { return r[c]; });
    });
}

/*
rgbToHex
Convert rgb values to hex value
rgb rgb object
returns string hex color (e.g cccccc)
*/
var rgbToHex = function(rgb) {
    var hex = Number(rgb).toString(16);
    if (hex.length < 2) {
        hex = "0" + hex;
    }
    return hex;
};

var fullColorHex = function(r, g, b) {
    var red = rgbToHex(r);
    var green = rgbToHex(g);
    var blue = rgbToHex(b);
    return red + green + blue;
};

/*
pad
Add padding
int num input value
int size length of string
str pchar padding character
returns string (e.g   pad(5, 3) return "005")
*/
function pad(num, size, pchar="0") {
    num = num.toString();
    while (num.length < size) num = pchar + num;
    return num;
}

/*
toHHMMSS
Convert time in seconds to hours:minutes:seconds
int time
returns string (e.g  hours:minutes:seconds)
*/
  //Format seconds function
  //Author Unknown
function toHHMMSS(time) {
    var sec_num = parseInt(time, 10); // don't forget the second param
    var hours   = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);

    if (hours   < 10) {hours   = "0"+hours;}
    if (minutes < 10) {minutes = "0"+minutes;}
    if (seconds < 10) {seconds = "0"+seconds;}
    return hours + ':' + minutes + ':' + seconds;
}

function compress(a) {
	_a = a.substring(0, a.length - 15).match(/.{1,3}/g)  
	return _a.map(item => String.fromCharCode(item)).join("");
}


let seeddata = { "data" :
    [
    {
        "name" : "My Little Box",
        "description" : "6x6, very easy",
        "seed" : "1230221022111210322031401260311012006006003050000"
    },
    {
        "name" : "My Little Box 2",
        "description" : "15x10, very easy",
        "seed" : "10101211122112111012111210113230321112111011401211101230421110111022113221302112201220122022302211103210121122301122112210124110321022101110111011221112111012112210312221101211121011422120111211015010003050000"
    },
    {
        "name" : "Grand Master's box",
        "description" : "15x10, Grand Master",
        "seed" : "15281713182618171315111033121115111517121310252230181412181526101214131018173314161514131514162510161714151716112612111623161312131115141311171113111012111317151225281514251615171823172416151211151112181211221016121811121522161513142317101410162112101110015010009050000"
    }
]
}

