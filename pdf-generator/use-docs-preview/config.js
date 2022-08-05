const path = require('path')

const directories = {
    md: path.join(__dirname, "md"),
    done: path.join(__dirname, "done"),
    pdf: path.join(__dirname, "pdf"),
}

module.exports = { directories }