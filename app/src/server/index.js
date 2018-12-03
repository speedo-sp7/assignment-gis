const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const bodyParser = require('body-parser');

app.use(express.static('dist'));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({ extended: false }));

const routes = require('./controllers/routes');
routes(app);

app.listen(port, () => console.log("FIIT PDT PROJECT: REST-ful API server started on port: " + port));

app.use((req, res) => {
    res.status(404).send({url: req.originalUrl + ' not found'})
});

//let myController = require('./controllers/controller');
//myController.get_all_special_places_near_station({body:{center:{lat:48.3077338759222,lng:17.0206976890053},distance:19780}}, null, null);