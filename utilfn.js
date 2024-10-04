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
            "seed": "J3E2C&JCRD3LZ6HSD06P6PG5f"
    },
    {
        "name" : "My Little Box 2",
        "description" : "15x10, very easy",
        "seed": "]ZB$?[Zh]K2GRh[ALZ[ZG42[AX2B3FKE+=ZDF3E2BC3(+3A1&F]OBH2;1VS1&J[Z+CeFU2h]LFWBU5AP0G5f"
    },
    {
        "name" : "Grand Master's box",
        "description" : "15x10, Grand Master",
        "seed": "a28cKd26dcKaBCIJBaBkJKC25F3A8LJda261ZLK]8cILblKlb25]6cLkb?6JBbNbKJKBlKBcBK[ZBKca$528l25bkdNcObaJBahdJ+]6JdhaFbaKLNc]4]62)B0A5AP0905f"
    }
]
}

