const express = require("express")
const cors = require("cors")
const { join } = require("path")
const listEndpoints = require("express-list-endpoints")
const helmet = require("helmet")
const YAML = require("yamljs")
const swaggerUI = require("swagger-ui-express")

const booksRouter = require("./services/books")
const filesRouter = require("./services/files")
const xmlRouter = require("./services/xml")

const {
  notFoundHandler,
  badRequestHandler,
  genericErrorHandler,
} = require("./errorHandlers")

const server = express()

const port = process.env.NODE_ENV !== "test" ? process.env.PORT : 3003

const swaggerDocument = YAML.load(join(__dirname, "./apiDescription.yml"))
const staticFolderPath = join(__dirname, "../public")
server.use(express.static(staticFolderPath))
server.use(express.json())

const whitelist =
  process.env.NODE_ENV === "production"
    ? [process.env.FE_URL]
    : ["http://localhost:3000", "http://localhost:3002"]
const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error("Not allowed by CORS"))
    }
  },
}

server.use(cors())

server.use(helmet())

server.use("/docs", swaggerUI.serve, swaggerUI.setup(swaggerDocument))
server.use("/books", booksRouter)
server.use("/files", filesRouter)
server.use("/xml", xmlRouter)

// ERROR HANDLERS MIDDLEWARES

server.use(badRequestHandler)
server.use(notFoundHandler)
server.use(genericErrorHandler)

console.log(listEndpoints(server))

server.listen(port, () => {
  console.log("Running on port", port)
})
