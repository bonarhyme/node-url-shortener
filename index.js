const express = require("express")
const app = express()
const connectDB = require("./config/db")
const ShortUrl = require("./models/urlModel")
const mongoose = require("mongoose")
const BASE_URI = "surlx.herokuapp.com"

// Database connection
require("dotenv/config")
connectDB()

// Set view engine
app.set("view engine", "ejs")

// To handle this, first url parser
app.use(express.urlencoded({ extended: false }))

// Homepage route
app.get("/", async (req, res) => {
  const shortUrls = await ShortUrl.find()
  res.render("index", { shortUrls, BASE_URI })
})

// Save to database after getting from users input
app.post("/shorturls", async (req, res) => {
  const value = await ShortUrl.create({ full: req.body.fullUrl })
  res.redirect("/")
})

app.get("/:shorturl", async (req, res) => {
  const foundShortUrl = await ShortUrl.findOne({
    short: req.params.shorturl,
  })

  if (foundShortUrl == null) return res.sendStatus(404)

  foundShortUrl.clicks++
  foundShortUrl.save()

  res.redirect(foundShortUrl.full)
})

app.listen(process.env.PORT || 5000)
