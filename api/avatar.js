const axios = require('axios');
const fs = require('fs-extra');
const { loadImage, createCanvas } = require('canvas');
const Canvas = require('canvas');
const path = require('path');
const data_anime = require('./tmp/anime.json');

exports.config = {
    name: "avatar",
    version: "1.0.0",
    author: "AceGerome",
    description: "Generate customized anime avatars with specified text and colors.",
    method: "get",
    link: ["/avatar?id=&bgtext=&signature=&color="],
    guide: "/avatar?id=4&bgtext=sumibot&signature=sumi&color=pink",
    category: "canvas"
};

async function generateAvatar({ id, chu_nen, chu_ky, coo }) {
    let pathImg = path.join(__dirname, `/tmp/avatar_1.png`);
    let pathAva = path.join(__dirname, `/tmp/avatar_2.png`);
    let pathLine = path.join(__dirname, `/tmp/avatar_3.png`);

    if (!coo) {
        coo = data_anime[id]?.colorBg;
    }

    const avatarAnime = (
        await axios.get(data_anime[id]?.imgAnime, { responseType: "arraybuffer" })
    ).data;

    const line = (
        await axios.get(
            "https://1.bp.blogspot.com/-5SECGn_32Co/YQkQ-ZyDSPI/AAAAAAAAv1o/nZYKV0s_UPY41XlfWfNIX0HbVoRLhnlogCNcBGAsYHQ/s0/line.png",
            { responseType: "arraybuffer" }
        )
    ).data;

    const background = (
        await axios.get("https://i.imgur.com/j8FVO1W.jpg", { responseType: "arraybuffer" })
    ).data;

    fs.writeFileSync(pathAva, Buffer.from(avatarAnime));
    fs.writeFileSync(pathLine, Buffer.from(line));
    fs.writeFileSync(pathImg, Buffer.from(background));

    const fonts = [
        {
            url: "https://drive.google.com/u/0/uc?id=1HsVzLw3LOsKfIeuCm9VlTuN_9zqucOni&export=download",
            path: path.join(__dirname, "/tmp/MTD William Letter.otf"),
            family: "MTD William Letter"
        },
        {
            url: "https://drive.google.com/u/0/uc?id=1SZD5VXMnXQTBYzHG834pHnfyt7B2tfRF&export=download",
            path: path.join(__dirname, "/tmp/SteelfishRg-Regular.otf"),
            family: "SteelfishRg-Regular"
        }
    ];

    for (const font of fonts) {
        if (!fs.existsSync(font.path)) {
            const fontData = (
                await axios.get(font.url, { responseType: "arraybuffer" })
            ).data;
            fs.writeFileSync(font.path, Buffer.from(fontData));
        }
        Canvas.registerFont(font.path, { family: font.family });
    }

    const baseImage = await loadImage(pathImg);
    const baseAva = await loadImage(pathAva);
    const baseLine = await loadImage(pathLine);

    const canvas = createCanvas(baseImage.width, baseImage.height);
    const ctx = canvas.getContext("2d");

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = coo;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.font = "430px SteelfishRg-Regular";
    ctx.textAlign = "center";
    ctx.fillStyle = "rgb(255 255 255 / 70%)";
    ctx.globalAlpha = 0.7;
    ctx.fillText(chu_nen.toUpperCase(), canvas.width / 2, 1350);

    ctx.globalAlpha = 1;
    ctx.strokeStyle = "white";
    ctx.lineWidth = 7;
    ctx.strokeText(chu_nen.toUpperCase(), canvas.width / 2, 900);
    ctx.strokeText(chu_nen.toUpperCase(), canvas.width / 2, 1800);

    ctx.drawImage(baseAva, 0, 0, 2000, 2000);
    ctx.drawImage(baseLine, 0, 0, canvas.width, canvas.height);

    ctx.font = "300px MTD William Letter";
    ctx.fillStyle = "#FFFFFF";
    ctx.fillText(chu_ky, canvas.width / 2, 350);

    const imageBuffer = canvas.toBuffer();
    fs.writeFileSync(pathImg, imageBuffer);

    return pathImg;
}

exports.initialize = async ({ req, res }) => {
    const { id, bgtext, signature, color } = req.query;

    if (!id || !bgtext || !signature) {
        return res.status(400).json({
            status: false,
            code: 400,
            message: "Missing parameters. Use ?id=4&bgtext=Ace&signature=A.gerome&color=blue"
        });
    }

    if (id < 0 || id > 882) {
        return res.status(404).json({
            status: false,
            code: 404,
            message: "Character ID not found."
        });
    }

    try {
        const avatarPath = await generateAvatar({ id, chu_nen: bgtext, chu_ky: signature, coo: color });
        res.sendFile(avatarPath);
    } catch (error) {
        res.status(500).json({
            status: false,
            code: 500,
            message: "An error occurred while processing your request.",
            error: error.message
        });
    }
};
