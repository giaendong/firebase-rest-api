"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const firebaseHelper = require("firebase-functions-helper");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require('cors');
const moment = require('moment');
admin.initializeApp(functions.config().firebase);
const db = admin.firestore();
const app = express();
app.use(cors());
const main = express();
const dressCollection = 'dress';
main.use('/api/v1', app);
main.use(bodyParser.json());
main.use(bodyParser.urlencoded({ extended: false }));
// webApi is your functions name, and you will pass main as 
// a parameter
exports.webApi = functions.https.onRequest(main);
// Simple CRUD
// Add new dress
app.post('/dress', (req, res) => {
    const now = moment().unix();
    const id = `dress-${now}`;
    firebaseHelper.firestore
        .createDocumentWithID(db, dressCollection, id, req.body);
    res.send('CREATE SUCCESS');
});
// Update new dress
app.patch('/dress/:dressId', (req, res) => {
    firebaseHelper.firestore
        .updateDocument(db, dressCollection, req.params.dressId, req.body);
    res.send('UPDATE SUCCESS');
});
// View a dress
app.get('/dress/:dressId', (req, res) => {
    firebaseHelper.firestore
        .getDocument(db, dressCollection, req.params.dressId)
        .then(doc => res.status(200).send(doc));
});
// View all dress with limit and page
app.get('/dress', (req, res) => {
    // DANGER - accept requests from everywhere
    // res.setHeader('Access-Control-Allow-Origin', '*');
    // Here allow all the HTTP methods you want
    // res.header('Access-Control-Allow-Methods', 'GET,POST,DELETE,HEAD,PUT,OPTIONS');
    // Here you allow the headers for the HTTP requests to your server
    // res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    const limit = parseInt(req.query.limit);
    const page = parseInt(req.query.page);
    const latestArray = (limit * (page - 1));
    let data = {};
    let lastVisible = {};
    data[dressCollection] = {};
    if (page <= 1) {
        db.collection(dressCollection).limit(limit).get().then(function (querySnapshot) {
            querySnapshot.forEach(doc => {
                // doc.data() is never undefined for query doc snapshots
                data[dressCollection][doc.id] = doc.data();
            });
            return res.status(200).send(data);
        }).catch(error => {
            console.log(error);
        });
    }
    else {
        db.collection(dressCollection).limit(latestArray).get().then(function (documentSnapshots) {
            lastVisible = documentSnapshots.docs[documentSnapshots.docs.length - 1];
            db.collection(dressCollection).startAfter(lastVisible).limit(limit).get().then(function (querySnapshot) {
                querySnapshot.forEach(doc => {
                    // doc.data() is never undefined for query doc snapshots
                    data[dressCollection][doc.id] = doc.data();
                });
                return res.status(200).send(data);
            }).catch(error => {
                console.log(error);
            });
        }).catch(error => {
            console.log(error);
        });
    }
    // firebaseHelper.firestore
    //     .backup(db, dressCollection)
    //     .then(data => res.status(200).send(data))
});
// Delete a dress 
app.delete('/dress/:dressId', (req, res) => {
    firebaseHelper.firestore
        .deleteDocument(db, dressCollection, req.params.dressId);
    res.send('DELETE SUCCESS');
});
//# sourceMappingURL=index.js.map