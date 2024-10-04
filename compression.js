//Layer 1 compression:
// when compressing replace these first
// when decompressing replace these last
const l1_comp = {
    "A" : "01",
    "B" : "11",
    "C" : "10",
    "D" : "20",
    "E" : "02",
    "F" : "22",
    "G" : "30",
    "H" : "03",
    "I" : "33",
    "J" : "12",
    "K" : "13",
    "L" : "14",
    "M" : "21",
    "N" : "23",
    "O" : "24",
    "P" : "00",
    "Q" : "04",
    "R" : "32",
    "a" : "15",
    "b":  "16",
    "c":  "17",
    "d":  "18",
    "e" : "31",
    "S": "BA",
    "T": "MA",
    "U": "2S",
    "V": "AS",
    "W": "JA",
    "X": "BE",
    "Z": "A2",
    "?": "B2",
    "&": "FB",
    "$": "1F",
    "=": "AF",
    "+": "BF",
    "[": "B1",
    "]": "1A",
    "(": "T2",
    ")": "BT",
    ";": "CF",
    "f": "PP",
    "h": "BJ",
    "i": "aa",
    "j": "ab",
    "k": "ac",
    "l": "aL",
    "g": "AW"
    /*"m": "",
    "n": "",
    "o": "",
    "p": "",
*/
}



function sg_compress(str) {
    for (const [key, value] of Object.entries(l1_comp)) {
        str = str.replaceAll(value, key)
    }
    return str;
}


function sg_decompress(str) {
    reverseForIn(l1_comp, function (key) { str = str.replaceAll(key, this[key]) });
    return str;
}

function reverseForIn(l1_comp, f) {
    var arr = [];
    for (var key in l1_comp) {
        arr.push(key);
    }
    for (var i = arr.length - 1; i >= 0; i--) {
        f.call(l1_comp, arr[i]);
    }
}
