const { loadFilesByExtensionInDirectory } = require('./src/read-files.js')
const { directories } = require('./config.js')
const { printPDF } = require('./src/print-pdf.js')
const { moveFileFromMdToDonePath } = require('./src/move-files.js')


    ; (async () => {
        try {

            // load md files from ./md/*
            const options = {
                directoryPath: directories.md,
                extension: 'md'
            }
            const files = await loadFilesByExtensionInDirectory(options)

            // foreach file, generate pdf
            // passing the given file
            for await (let file of files) {
                await printPDF(file)
                // after generate pdf
                // move file from ./md to ./done
                await moveFileFromMdToDonePath(file)
            }

        } catch (err) {
            console.log('ERR ', err)
        }

    })()