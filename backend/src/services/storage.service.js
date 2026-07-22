import ImageKit from '@imagekit/nodejs'
import { config } from '../config/config.js'

const client = new ImageKit({
    publicKey: process.env.IMAGE_PUBLIC_KEY || "dummy_public_key",
    privateKey: config.IMAGE_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGE_URL_ENDPOINT || "https://ik.imagekit.io/dummy"
})

export async function uploadFile({ buffer, fileName, folder = "VELORA" } = {}) {
    const result = await client.files.upload({
        file: buffer,
        fileName,
        folder
    })
    return result
}