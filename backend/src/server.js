import express from 'express';
import bodyParser from 'body-parser';
import fs from 'fs';
import https from 'https';
import http from 'http';

const app = express();
const port = process.env.port || 8005;

// Used to translate the request body
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true })); 

// Include static files for the APP
//app.use(express.static(path.join(__dirname, '/build')));

let sightings = {
    "sightings": [
        {
            id: 1, 
            createdAt:"2020-07-21T13:05:19.436Z",
            latitude:44.9089422420112,
            longitude:-7901792782327557
        }
    ]
}

app.get('/api/sightings', (req, res) => {
    console.log('Returning Sightings');
    res.status(200).json(sightings);
});

let id = 2;
app.post('/api/sightings/create', (req, res) => {
    const { sighting } = req.body;
    sighting.createdAt = new Date();
    sighting.id = id;
    id++;
    sightings.sightings.push(sighting);
    console.log('New sighting added', sighting)
    res.status(200).json(sightings);
});

// any other requests for the API get passed onto our APP
//app.get('*', (req, res) => {
//    res.sendFile(path.join(__dirname + '/build/index.html'));
//})


const credentials = {key: fs.readFileSync('server.key'), cert: fs.readFileSync('server.cert')};
const httpServer = http.createServer(app);
const httpsServer = https.createServer(credentials, app);
httpServer.listen(8080, () => console.log(`listening on port 8080 for http`));
httpsServer.listen(8443, () => console.log(`listening on port 8443 for https`));

// https.createServer({
//     key: fs.readFileSync('server.key'),
//     cert: fs.readFileSync('server.cert')
//   }, app).listen(port, () => console.log(`listening on port ${port}`));
  
//app.listen(port, () => console.log(`listening on port ${port}`));