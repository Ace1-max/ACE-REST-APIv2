exports.config = {
    name: 'textencode',
    author: 'AceGerome',
    description: 'Tools for encoding and decoding text in Base64 and binary formats.',
    method: 'get',
    category: 'tools',
    link: ['/textencode?text=&type=base64']
};

exports.initialize = async function ({ req, res }) {
    try {
        const text = req.query.text;
        const type = req.query.type;

        if (!text) {
            return res.json({
                status: false,
                creator: this.config.author,
                message: "[!] Please provide a text parameter."
            });
        }

        if (text.length > 2048) {
            return res.json({
                status: false,
                creator: this.config.author,
                message: "[!] Maximum length is 2,048 characters!"
            });
        }

        if (!type) {
            return res.json({
                status: false,
                creator: this.config.author,
                message: "[!] Please specify the type (base64 or binary)."
            });
        }

        let result;

        if (type === 'base64') {
            result = Buffer.from(text).toString('base64');
        } else if (type === 'debase64') {
            result = Buffer.from(text, 'base64').toString('ascii');
        } else if (type === 'binary') {
            result = text.split("").map(char => {
                return char.charCodeAt(0).toString(2).padStart(8, '0');
            }).join(" ");
        } else if (type === 'debinary') {
            result = text.split(" ").map(bin => {
                return String.fromCharCode(parseInt(bin, 2));
            }).join("");
        } else {
            return res.json({
                status: false,
                creator: this.config.author,
                message: "[!] Invalid type specified. Use 'base64', 'debase64', 'binary', or 'debinary'."
            });
        }

        res.json({
            status: true,
            creator: this.config.author,
            result: result
        });
    } catch (error) {
        console.error("Error processing text encoding/decoding request:", error);
        return res.json({
            status: false,
            creator: this.config.author,
            message: "An error occurred while processing the request.",
            error: error.message || "Unknown error occurred."
        });
    }
};
