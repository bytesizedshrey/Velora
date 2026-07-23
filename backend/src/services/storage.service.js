import ImageKit from '@imagekit/nodejs'
import { config } from '../config/config.js'

const client = new ImageKit({
    publicKey: process.env.IMAGE_PUBLIC_KEY || "dummy_public_key",
    privateKey: config.IMAGE_PRIVATE_KEY || "dummy_private_key",
    urlEndpoint: process.env.IMAGE_URL_ENDPOINT || "https://ik.imagekit.io/dummy"
})

export async function uploadFile({ buffer, fileName, folder = "VELORA" } = {}) {
    // Timeout wrapper to guarantee request never hangs if ImageKit network call blocks
    const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("ImageKit upload timeout")), 5000)
    )

    const fileContent = Buffer.isBuffer(buffer) ? buffer.toString('base64') : buffer

    const uploadPromise = client.files.upload({
        file: fileContent,
        fileName: fileName || "upload.jpg",
        folder
    })

    return await Promise.race([uploadPromise, timeoutPromise])
}