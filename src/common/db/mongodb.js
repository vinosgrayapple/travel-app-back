const mongoose = require('mongoose')
const { MONGO_CONNECTION_STRING } = require('../config')
const logger = require('../logging/logger')
// const Country = require('../../modules/countries/country.schema')

const connectToDB = () => {
  mongoose
    .connect(MONGO_CONNECTION_STRING, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    })
    .catch((err) => logger.error(err.message))

  const db = mongoose.connection
  db.once('open', async () => {
    logger.info('Mongo connection successfully!')
    // or, for inserting large batches of documents
    // Country.insertMany(
    //   [
    //     {
    //       imageUrl:
    //         'https://cdn.webshopapp.com/shops/94414/files/52440074/flag-of-ukraine.jpg',
    //       videoUrl: 'https://www.youtube.com/watch?v=fu6-L9CsYOo',
    //       currency: 'UAH',
    //       ISOCode: 'UA',
    //       capitalLocation: { type: 'Point' },
    //       coordinates: ['50.663', '49.521'],
    //       localizations: [
    //         {
    //           name: 'en',
    //           capital: 'Kyiv',
    //           description: 'lorem'
    //         }
    //       ]
    //     }
    //   ],
    //   function (err) {
    //     if (err) console.log(err)
    //   }
    // )
  })
}

module.exports = { connectToDB }
