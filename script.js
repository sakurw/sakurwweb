//トリミング、軽量化、tokenが過剰パターンの処理
const fumen_data_format = {
    "A": 0, "B": 1, "C": 2, "D": 3, "E": 4, "F": 5, "G": 6, "H": 7, "I": 8, "J": 9, "K": 10, "L": 11, "M": 12, "N": 13, "O": 14, "P": 15, "Q": 16, "R": 17, "S": 18, "T": 19, "U": 20, "V": 21,
    "W": 22, "X": 23, "Y": 24, "Z": 25, "a": 26, "b": 27, "c": 28, "d": 29, "e": 30, "f": 31, "g": 32, "h": 33, "i": 34, "j": 35, "k": 36, "l": 37, "m": 38, "n": 39, "o": 40, "p": 41, "q": 42, "r": 43,
    "s": 44, "t": 45, "u": 46, "v": 47, "w": 48, "x": 49, "y": 50, "z": 51, "0": 52, "1": 53, "2": 54, "3": 55, "4": 56, "5": 57, "6": 58, "7": 59, "8": 60, "9": 61, "+": 62, "/": 63
}

//譜面、連結開始番号   
let input_fumen = [["v115@9gwhBeQ4EeAtwhBeR4CeBtwhRpg0Q4CeAtglwhRpi0?AeilJeAgHegwhGeRpwhGeRpwhhlh0DeAtwhAeglg0DeBtBe?glg0DeAtfeAgHWhywHewwMeAgHvhAAgHLhQ4IeR4IeQ4NeA?gH", 1], ["v115@egwhDeRpCewhDeRpCewhhlh0Q4Dexhglg0S4CeAtwh?glg0S4BeBtwhRpg0Q4CeAtglwhRpi0AeilJeAgHWhywHeww?MeAgHvhAAgHPhAtHeBtHeAtLeAgH", 2]];
//edge
let input_edge = [[1, 5], [2], [3], [4], [], [6], [7], [8], []];
let fields = new Array();
let page_div_num = new Array();

input_fumen.forEach(function (fumen) {
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
    //次譜面の開始番号を記録
    page_div_num.push(fields.length);
});

//盤面描画
field_width = 300;
field_height = (field_width / 10) * 23;
field_color = 0xdcdcdc;

const field_graphic = new PIXI.Application({
    width: field_width,
    height: field_height,
    backgroundColor: field_color,
    resolution: 1,
    autoDensity: true
});
document.getElementById("fumen_display").appendChild(field_graphic.view);

let token_positions = new Array(fields.length - 1);

//ネットグラフのステージ生成
net_width = 900;
net_height = 300;
net_color = 0xdcdcdc;
const net_graphic = new PIXI.Application({
    width: net_width,
    height: net_height,
    backgroundColor: net_color,
    resolution: 1,
    autoDensity: true
});

document.getElementById("net_display").appendChild(net_graphic.view);

//token配置用の配列に変換
let net_fields_index = new Array;
for (index_copy_index = 0; index_copy_index <= fields.length - 1; index_copy_index++) {
    net_fields_index.push(index_copy_index);
}
let fumens = new Array();
let token_x_length = page_div_num[0];
for (div_num_index = 0; div_num_index <= page_div_num.length - 2; div_num_index++) {
    if (token_x_length < page_div_num[div_num_index] - page_div_num[div_num_index - 1]) {
        token_x_length = page_div_num[div_num_index] - page_div_num[div_num_index - 1];
    }
}
for (fumens_index = 0; fumens_index <= token_x_length - 1; fumens_index++) {
    fumens.push([]);
}
let div_index = 0;
for (fumen_index = 0; fumen_index <= net_fields_index.length - 1; fumen_index++) {
    if (fumen_index === page_div_num[div_index]) {
        div_index++
    }
    if (page_div_num[div_index - 1] === undefined) {
        fumens[(fumen_index + input_fumen[div_index][1]) - 1].push(net_fields_index[fumen_index]);
    }
    else {
        fumens[((fumen_index % page_div_num[div_index - 1]) + input_fumen[div_index][1]) - 1].push(net_fields_index[fumen_index]);
    }

}

//token座標のみ取得
token_x = 30;
token_space = 100;
token_color = 0x1e308a;

fumens.forEach(function (stage) {
    let put_row = 1;
    stage.forEach(function (fumen_index_num) {
        token_positions[fumen_index_num] = [token_x, (net_height * put_row) / (stage.length + 1)];
        put_row++;
    });
    token_x += token_space;
});

//edge生成
const edge_graphics = new PIXI.Graphics();
edge_graphics.lineStyle(2, 0x111111);
for (input_edge_index = 0; input_edge_index <= input_edge.length - 1; input_edge_index++) {
    let from_token_positon = token_positions[input_edge_index];
    input_edge[input_edge_index].forEach(function (to_token) {
        let to_token_position = token_positions[to_token];
        edge_graphics.moveTo(from_token_positon[0], from_token_positon[1]);
        edge_graphics.lineTo(to_token_position[0], to_token_position[1]);
    });
}
edge_graphics.lineStyle();
net_graphic.stage.addChild(edge_graphics);

//token配置
token_x = 30;
token_space = 100;
fumens.forEach(function (stage) {
    let put_row = 1;
    stage.forEach(function (fumen_index_num) {
        const token_graphic = new PIXI.Graphics();
        token_graphic.lineStyle(1, 0x000000, 1, 1);
        token_graphic.beginFill(token_color);
        token_graphic.drawCircle(token_x, (net_height * put_row) / (stage.length + 1), net_height / 15);
        token_graphic.endFill();
        token_graphic.lineStyle();
        token_graphic.interactive = true;
        token_graphic.buttonMode = true;
        net_graphic.stage.addChild(token_graphic);
        token_graphic.on("pointerup", () => { click_token(fumen_index_num) });
        token_positions[fumen_index_num] = [token_x, (net_height * put_row) / (stage.length + 1)];
        put_row++;
    });
    token_x += token_space;
});
let pre_token_position = token_positions[0];
click_token(0);

//csv
const request = new XMLHttpRequest();
request.addEventListener("load", (event) => {
    const response = event.target.responseText;
    document.getElementById("csv").innerHTML = response;
});
request.open("GET", "cover.csv", true);
request.send();


//tokenクリック関数
function click_token(fumen_index_num) {
    const token_graphic = new PIXI.Graphics();
    token_graphic.lineStyle(1, 0x000000, 1, 1);
    token_graphic.beginFill(token_color);
    token_graphic.drawCircle(pre_token_position[0], pre_token_position[1], net_height / 15);
    token_graphic.lineStyle();
    token_graphic.lineStyle(1, 0xFF0000, 1, 1);
    token_graphic.beginFill(token_color);
    token_graphic.drawCircle(token_positions[fumen_index_num][0], token_positions[fumen_index_num][1], net_height / 15);
    token_graphic.endFill();
    token_graphic.lineStyle();
    net_graphic.stage.addChild(token_graphic);
    pre_token_position = token_positions[fumen_index_num];
    render(fumen_index_num);
}
//譜面描画関数
function render(field_index) {
    console.log(field_index);
    field = fields[field_index]

    //テト譜描画
    row_point = 0;
    col_point = 0;
    mino_scale = field_width / 10;
    const mino_graphic = new PIXI.Graphics();
    let mino_color = 0x000000;
    for (mino_index = 0; mino_index <= field.length - 1; mino_index++) {

        if (col_point === 0 & row_point === 24 * mino_scale) {
            break;
        }
        mino = field[mino_index];

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
        col_point += mino_scale;
        if (col_point >= field_width) {
            row_point += mino_scale;
            col_point = 0;
        }
    }
    mino_graphic.endFill();
    field_graphic.stage.addChild(mino_graphic);

    //grid描画
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
