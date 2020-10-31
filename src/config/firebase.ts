import * as admin from 'firebase-admin';

const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://stapler-api.firebaseio.com',
});

export const db = admin.firestore();
export const st = admin.storage();
export const FieldValue = admin.firestore.FieldValue;
export const documentId = admin.firestore.FieldPath.documentId();
