const fs = require('fs/promises')
const path = require('path')

async function exists(path) {
    try {
        await fs.access(path)
        return path
    } catch {
        return false
    }
}

const loadFilesByExtensionInDirectory = async ({ directoryPath, extension }) => {
    const files = await fs.readdir(directoryPath)
    const loaded = files
        .filter(file => file.includes(extension))

    return loaded
}

const mdContentFromFile = async filepath => {
    const file = await fs.readFile(filepath)
    return file.toString()
}

module.exports = { exists, loadFilesByExtensionInDirectory, mdContentFromFile }