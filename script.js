const fumen_data_format = {
    "A": 0, "B": 1, "C": 2, "D": 3, "E": 4, "F": 5, "G": 6, "H": 7, "I": 8, "J": 9, "K": 10, "L": 11, "M": 12, "N": 13, "O": 14, "P": 15, "Q": 16, "R": 17, "S": 18, "T": 19, "U": 20, "V": 21,
    "W": 22, "X": 23, "Y": 24, "Z": 25, "a": 26, "b": 27, "c": 28, "d": 29, "e": 30, "f": 31, "g": 32, "h": 33, "i": 34, "j": 35, "k": 36, "l": 37, "m": 38, "n": 39, "o": 40, "p": 41, "q": 42, "r": 43,
    "s": 44, "t": 45, "u": 46, "v": 47, "w": 48, "x": 49, "y": 50, "z": 51, "0": 52, "1": 53, "2": 54, "3": 55, "4": 56, "5": 57, "6": 58, "7": 59, "8": 60, "9": 61, "+": 62, "/": 63
}
let field = new Array();
for (field_index = 0; field_index <= 239; field_index++) {
    field.push(0);
}
var fumens = [["v115@dhwhglQpAtwwg0Q4A8JeAgHch3hAAJeAgH", 1]];

fumens.forEach(function (fumen) {
    //field初期化
    let field = new Array();
    for (field_index = 0; field_index <= 239; field_index++) {
        field.push(0);
    }
    console.log(field);
    let page_num = new Array();
    page_codes = fumen[0].substr(5).split("AgH");
    page_codes.pop();
    page_codes.forEach(function (page_code) {
        let even_char_num = 0;
        var minos = new Array();
        var block_nums = new Array();

        for (char_index = 0; char_index < page_code.length; char_index++) {
            if (char_index % 2 === 0) {
                even_char_num = fumen_data_format[page_code.charAt(char_index)];
            }
            else {
                poll = even_char_num + fumen_data_format[page_code.charAt(char_index)] * 64;
                minos.push(Math.floor(poll / 240) - 8);
                block_nums.push(poll % 240 + 1);
            }
        }
        page_num.push(minos);
        page_num.push(block_nums);
    });
    for (page_index = 0; page_index <= page_num.length - 1; page_index += 2) {
        var field_block_index = 0;
        for (blocks_index = 0; blocks_index <= page_num[page_index].length; blocks_index++) {
            for (block_num_index = 0; block_num_index <= page_num[page_index + 1][blocks_index] - 1; block_num_index++) {
                field[field_block_index] += page_num[page_index][blocks_index]
                field_block_index++
            }
        }
        console.log(field);
    }


});