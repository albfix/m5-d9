const klaw = require("klaw")
const { join } = require("path")

const publicFolder = join(__dirname, "../../../public")

const exploreFolders = (path) => {
  return new Promise(async (res, rej) => {
    let responseArray = []

    klaw(path, {})
      .on("data", (item) => {
        const name = item.path.split("\\").pop()
        const isDir = item.stats.isDirectory()
        responseArray.push({
          isDir,
          name,
          path: item.path.split("\\").join("/"),
          url: item.path
            .replace(
              publicFolder,
              `${process.env.BASE_URL}:${process.env.PORT}`
            )
            .split("\\")
            .join("/"),

          extension: !isDir ? name.split(".").pop() : "",
        })
        console.log(responseArray)
      })
      .on("end", () => res(responseArray))
      .on("error", (err) => rej(new Error(err)))
  })
}

module.exports = exploreFolders
