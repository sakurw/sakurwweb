//トリミング、軽量化
const fumen_data_format = {
    "A": 0, "B": 1, "C": 2, "D": 3, "E": 4, "F": 5, "G": 6, "H": 7, "I": 8, "J": 9, "K": 10, "L": 11, "M": 12, "N": 13, "O": 14, "P": 15, "Q": 16, "R": 17, "S": 18, "T": 19, "U": 20, "V": 21,
    "W": 22, "X": 23, "Y": 24, "Z": 25, "a": 26, "b": 27, "c": 28, "d": 29, "e": 30, "f": 31, "g": 32, "h": 33, "i": 34, "j": 35, "k": 36, "l": 37, "m": 38, "n": 39, "o": 40, "p": 41, "q": 42, "r": 43,
    "s": 44, "t": 45, "u": 46, "v": 47, "w": 48, "x": 49, "y": 50, "z": 51, "0": 52, "1": 53, "2": 54, "3": 55, "4": 56, "5": 57, "6": 58, "7": 59, "8": 60, "9": 61, "+": 62, "/": 63
}

//譜面、連結番号   
let fumens = [["v115@7gAtAewhBeQ4CeCtwhBeR4BeCtwhRpg0Q4CeAtglwh?Rpi0AeilJeAgHWhywHewwMeAgHygwhGeRpwhGeRpwhhlh0Q?4ywAewhAeglg0AeR4wwDeglg0BeQ4NeAgHvhAAgH", 1, 2]];
let fields = new Array();

fumens.forEach(function (fumen) {
    //field初期化
    let field = new Array();
    for (field_index = 0; field_index <= 239; field_index++) {
        field.push(0);
    }
    fumen_code = fumen[0].replace(/\?/g, "").substr(5);

    let even_char_num = 0;
    var minos = new Array();
    var block_nums = new Array();
    let block_count = 0;
    let line_clear_frag = 0;
    let clear_line = new Array();
    for (char_index = 0; char_index < fumen_code.length; char_index++) {
        if (char_index % 2 === 0) {
            even_char_num = fumen_data_format[fumen_code.charAt(char_index)];
        }
        else {
            poll = even_char_num + fumen_data_format[fumen_code.charAt(char_index)] * 64;
            minos.push(Math.floor(poll / 240) - 8);
            block_nums.push((poll % 240) + 1);
            block_count += (poll % 240) + 1;
        }
        //ページ化(軽量化ポイント)
        if (block_count === 240) {
            let block_index = 0;
            for (mino_index = 0; mino_index <= minos.length; mino_index++) {
                for (block_num_index = 0; block_num_index <= block_nums[mino_index] - 1; block_num_index++) {
                    field[block_index] += minos[mino_index];
                    if (block_index % 10 === 9) {
                        if (field[block_index] !== 0 & line_clear_frag === 9) {
                            clear_line.push(Math.floor(block_index / 10) * 10);
                        }
                        line_clear_frag = 0;

                    }
                    else if (field[block_index] !== 0) {
                        line_clear_frag++;
                    }
                    block_index++
                }
            }
            fields.push(field.concat());
            minos = [];
            block_nums = [];
            block_count = 0;
            fumen_code = fumen_code.substr(char_index + 4,);
            char_index = -1
            //line消去処理（pushが完了しているのでfieldを置き換える）
            clear_line.forEach(function (clear_row) {
                //前のfieldに影響している?
                field.splice(clear_row, 10);
                field.unshift(0, 0, 0, 0, 0, 0, 0, 0, 0, 0)
            });
            clear_line = [];
            //空ページ処理(64ページまで)
            if (fumen_code.charAt(0) === "v" & fumen_code.charAt(1) === "h") {
                for (none_page_index = 0; none_page_index <= fumen_data_format[fumen_code.charAt(2)]; none_page_index++) {
                    fields.push(Array.from(field))
                }
                fumen_code = fumen_code.substr(((fumen_data_format[fumen_code.charAt(2)] + 1) * 3) + 3);
            }

        }
    }
});
render[0];



function render(field) {
    field_width = 300;
    field_height = (field_width / 10) * 23;
    field_color = 0xdcdcdc
    window.onload = function () {
        const field_graphic = new PIXI.Application({
            width: field_width,
            height: field_height,
            backgroundColor: field_color,
            resolution: 1,
            autoDensity: true
        });
        document.getElementById("fumen_display").appendChild(field_graphic.view);
        row_point = 0;
        col_point = 0;
        mino_scale = field_width / 10;

        for (mino_index = 0; mino_index <= field.length - 1; mino_index++) {

            if (col_point === 0 & row_point === 24 * mino_scale) {
                break;
            }
            mino = field[mino_index];
            const mino_graphic = new PIXI.Graphics();
            let mino_color = 0x000000;

            switch (mino) {
                case 0:
                    mino_color = 0xdcdcdc
                    break;
                case 1:

                    mino_color = 0x41afde;
                    break;
                case 2:

                    mino_color = 0xef9535;
                    break;
                case 3:

                    mino_color = 0xf7d33e;
                    break;
                case 4:

                    mino_color = 0xef624d;
                    break;
                case 5:

                    mino_color = 0xb451ac;
                    break;
                case 6:

                    mino_color = 0x1983bf;
                    break;
                case 7:

                    mino_color = 0x66c65c;
                    break;
                case 8:

                    mino_color = 0x808080;
                    break;
            }
            mino_graphic.beginFill(mino_color);
            mino_graphic.drawRect(col_point, row_point, mino_scale, mino_scale);
            mino_graphic.endFill();
            field_graphic.stage.addChild(mino_graphic);

            col_point += mino_scale;
            if (col_point >= field_width) {
                row_point += mino_scale;
                col_point = 0;
            }
        }
        const grid_graphic = new PIXI.Graphics();
        grid_graphic.lineStyle(1, 0xffffff, .6);
        for (col_grid_start_index = mino_scale; col_grid_start_index <= 9 * mino_scale; col_grid_start_index += mino_scale) {
            grid_graphic.moveTo(col_grid_start_index, 4 * mino_scale);
            grid_graphic.lineTo(col_grid_start_index, field_height);
        }
        for (row_grid_start_index = 4 * mino_scale; row_grid_start_index <= 22 * mino_scale; row_grid_start_index += mino_scale) {
            grid_graphic.moveTo(0, row_grid_start_index);
            grid_graphic.lineTo(field_width, row_grid_start_index);
        }
        grid_graphic.lineStyle();
        grid_graphic.lineStyle(3, 0xffffff, .6, 0);
        grid_graphic.moveTo(0, row_grid_start_index + mino_scale);
        grid_graphic.lineTo(field_width, row_grid_start_index + mino_scale);
        grid_graphic.lineStyle();
        field_graphic.stage.addChild(grid_graphic);


    }
}
