const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const address = '134.169.114.202' || '192.168.56.1';
const cors = require('cors')
require("dotenv").config();
// for mqtt 
const mqtt = require('mqtt');
const mqtt_port = process.env.MQTT_PORT || 1883;
const mqtt_ip = process.env.MQTT_IP || '192.168.1.10';
const path = require("path");
const { writeFile } = require("fs/promises");

app.use(express.json());
app.use(cors({
    'allowedHeaders': ['Content-Type'],
    'origin': '*',
    'preflightContinue': true
}));

app.get('/', (req, res) => {
    res.send('Hello World!')
})

// mqtt connection
const options = {
    // Clean Session
    clean: true,
    connectTimeout: 4000,
}
const client = mqtt.connect(`mqtt://${mqtt_ip}:${mqtt_port}`, options);
let mqtt_buffer_human = '';
let mqtt_buffer_vehicle = '';

client.on('connect', function () {
    console.log("connected to mqtt");
    client.subscribe('position', function (err) {
        if (err) {
            console.log(err);
        }
    })
})

client.on('message', function (topic, payload, packet) {
    // console.log('mqtt payload: ', payload.toString());
    // payload is buffer
    if (payload['human']) {
        mqtt_buffer_human = payload['human']
    }
    if (payload['vehicle']) {
        mqtt_buffer_vehicle = payload['vehicle']
    }
    console.log(payload['human'], '++++', payload['vehicle']);
    console.log(mqtt_buffer_human, '----', mqtt_buffer_vehicle);
})

app.post('/api/live', (req, res) => {
    const source = req.body.source;
    const table = req.body.table;
    const resource = req.body.resource;

    // this statement is added to send the building map via backend (not currently being used)
    if (table === "map") {
        const map = req.body.map;
        map_data = require(`./public/data/maps/${map}.json`)
        res.json({
            status: "success",
            map_data
        });
    }
    if (source === 'mqtt') {
        let data = [];

        if (mqtt_buffer_human !== "" && resource !== "vehicle") {
            data = [...data, {
                "type": "human",
                "value": mqtt_buffer_human
            }]
            mqtt_buffer_human = "";
        }
        if (mqtt_buffer_vehicle !== "" && resource !== "human") {
            data = [...data, {
                "type": "vehicle",
                "value": mqtt_buffer_vehicle
            }]
            mqtt_buffer_vehicle = "";
        }

        // for testing purpose

        //     if (resource === "human") {
        //         return res.json({
        //             data: [
        //                 {
        //                     type: 'human',
        //                     value: '{"0":{"x": 0, "y": 0, "heading": 0.0},"2":{"x": 21.848, "y": 25.879, "heading": 0.184}}'
        //                 },
        //             ]
        //         });
        //     }
        //     else if (resource === "vehicle") {
        //         return res.json({
        //             data: [
        //                 {
        //                     type: 'vehicle',
        //                     value: '{"0":{"x": 15.131, "y": 50.075, "heading": -0.443}}'
        //                 },
        //             ]
        //         });
        //     }
        //     else {
        //         return res.json({
        //             data: [
        //                 {
        //                     type: 'human',
        //                     value: '{"0":{"x": 0, "y": 0, "heading": 0.0},"2":{"x": 21.848, "y": 25.879, "heading": 0.184}}'
        //                 },
        //                 {
        //                     type: 'vehicle',
        //                     value: '{"0":{"x": 15.131, "y": 50.075, "heading": -0.443}}'
        //                 },
        //             ]
        //         });
        //     }

            return res.json({ data })
    }
    res.status(400).json({ error: "invalid request parameters" });
})

app.get("/selected_area", async (req, res) => {
    res.header("Content-Type", 'application/json');
    res.sendFile(path.join(__dirname, "/selected-area.json"));
});

app.post("/selected_area", async (req, res) => {
    writeFile(path.resolve(__dirname, "./selected-area.json"), JSON.stringify(req.body))
        .then(function () {
            return res.status(200).send({ message: "Updated Succesfully" });
        })
        .catch(function (err) {
            console.log(err);
            return res.status(500).send({ message: "Internal server error" });
        });
});

// app.listen(port,'10.42.0.1', () => {
//     console.log(`Nodejs backend listening on Port: ${port}`);
// }).on("error", (err) => {
app.listen(port, () => {
    console.log(`Nodejs backend listening on Port: ${port}`);
})
// })
