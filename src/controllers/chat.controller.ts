import { Message } from '../models/message.model';
import { db } from '../config/firebase';
import { Request, Response } from 'express';

const messagesRef = db.collection('conversations');

export const addMessage = async (req: Request, res: Response) => {
    const message = {
        createdAt: new Date().getTime(),
        text: req.body.text,
        user: req.body.user
    } as Message;

    await messagesRef.doc('mHRJVnz0711rS1y1Of0E').collection('messages')
        .add(message)
        .then(data => {
            return res.status(201).json(data.id);
        })
        .catch(err => {
            return res.status(500).send({
                message: err.message || 'Some error occurred while creating new user',
            });
        });
};

export const getMessages =  (req: Request, res: Response) => {
    messagesRef.doc('mHRJVnz0711rS1y1Of0E').collection('messages')
    .orderBy('createAt', 'desc').get()
    .then(users => {
        const results: {
            _id: string;
            data: FirebaseFirestore.DocumentData;
        }[] = [];

        users.forEach(user => results.push({ _id: user.id, data: user.data() }));
        const arr = results.map(user => {
            return {
            _id: user._id,
            ...user.data
            }
        })
        if (arr.length) {
            res.status(200).json(arr);
        } else {
            res.status(404).json({ detail: 'No records found' });
        }
    })
    .catch(err => {
        res.status(500).json(err);
    });
};
