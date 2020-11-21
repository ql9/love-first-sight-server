import { db } from '../config/firebase';
import { Request, Response } from 'express';

const usersRef = db.collection('users');

export const getUsersLiked = async (req: Request, res: Response) => {
    await usersRef
        .where('likedUsers', 'array-contains', req.params.userId)
        .get()
        .then(users => {
            const results: {
                userId: string;
                data: FirebaseFirestore.DocumentData;
            }[] = [];
            users.forEach(user => results.push({ userId: user.id, data: user.data() }));
            if (results.length) {
                res.status(200).json(results);
            } else {
                res.status(404).json({ detail: 'No records found' });
            }
        })
        .catch(err => {
            res.status(500).json(err);
        });
};

export const getUsersOnTop = async (req: Request, res: Response) => {
    await usersRef
        .orderBy('superLike', 'desc')
        .limit(10)
        .get()
        .then(users => {
            const results: {
                userId: string;
                data: FirebaseFirestore.DocumentData;
            }[] = [];
            users.forEach(user => results.push({ userId: user.id, data: user.data() }));
            if (results.length) {
                res.status(200).json(results);
            } else {
                res.status(404).json({ detail: 'No records found' });
            }
        })
        .catch(err => {
            res.status(500).json(err);
        });
};
