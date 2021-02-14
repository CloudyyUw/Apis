const Jimp = require('jimp');
import Cors from 'cors'

const cors = Cors({
    methods: ['GET', 'HEAD'],
})

function runMiddleware(req, res, fn) {
    return new Promise((resolve, reject) => {
        fn(req, res, (result) => {
            if (result instanceof Error) {
                return reject(result)
            }

            return resolve(result)
        })
    })
}
export default async function handler(req, res) {
    res.setHeader("Cache-Control", "s-maxage=10, stale-while-revalidate");
    await runMiddleware(req, res, cors)
    let apiKEY = req.query.key;
    if (apiKEY !== process.env.VALIDKEY) {
        return res.status(400).json({
            status: "400: Bad Request",
            message: "Invalid key"
        })
    } // temp
    const { image } = req.query;
    const Image = await Jimp.read(image);
    if (!Image) {
        return res.status(400).json({
            status: "400: Bad Request",
            message: "You need to provide a valid image."
        })
    };
    Image.normalize()
    const buffer = await Image.getBufferAsync("image/png");
    return res.end(buffer)
}