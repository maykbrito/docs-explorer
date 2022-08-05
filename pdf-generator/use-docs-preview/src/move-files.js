const path = require('path')
const fs = require('fs/promises')
const { directories } = require('../config')

const move = async (from, to, file) => {
    const filePath = path.join(from, file)
    const newFilePath = path.join(to, file)

    try {
        await fs.rename(filePath, newFilePath)
    } catch (error) {
        throw new Error(`Error moving file ${filePath} to ${newFilePath}`)
    }
}

const moveFileFromMdToDonePath = async filename => {
    await move(directories.md, directories.done, filename)
}

module.exports = { moveFileFromMdToDonePath }