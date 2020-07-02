const express = require("express")
const { join } = require("path")
const { pathExists } = require("fs-extra")

const exploreFolders = require("./explore-folders")

const publicFolder = join(__dirname, "../../../public/")

const filesRouter = express.Router()

filesRouter.get("/", async (req, res, next) => {
  const path = req.query.folder
    ? join(publicFolder, req.query.folder)
    : publicFolder

  const exists = await pathExists(path)

  try {
    if (!exists) {
      throw new Error("Folder does not exists!")
    }
    const response = await exploreFolders(path)
    res.send(response)
  } catch (error) {
    next(error)
  }
})

module.exports = filesRouter
