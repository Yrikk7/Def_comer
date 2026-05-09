const { Schema, model } = require("mongoose")

const Storage = new Schema({
    name: { type: String, default: "file/n_abcdfegji.text" },
    content: { type: String, default: "a9W7X07SUjEU4tX3QagnDg==" },
    ruleKod: { type: String, default: "!!!!!!!!!!!!" }
})

module.exports = model("Storage", Storage)