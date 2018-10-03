"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const firebaseHelper = require("firebase-functions-helper");
const express = require("express");
const bodyParser = require("body-parser");
const moment = require('moment');
admin.initializeApp(functions.config().firebase);
const db = admin.firestore();
const app = express();
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
// View all dress
app.get('/dress', (req, res) => {
    firebaseHelper.firestore
        .backup(db, dressCollection)
        .then(data => res.status(200).send(data));
});
// Delete a dress 
app.delete('/dress/:dressId', (req, res) => {
    firebaseHelper.firestore
        .deleteDocument(db, dressCollection, req.params.dressId);
    res.send('DELETE SUCCESS');
});
//# sourceMappingURL=index.js.map