import * as admin from 'firebase-admin';

const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://stapler-cf434.firebaseio.com',
});

export const db = admin.firestore();
export const st = admin.storage();
export const ms = admin.messaging();
export const FieldValue = admin.firestore.FieldValue;
export const documentId = admin.firestore.FieldPath.documentId();
