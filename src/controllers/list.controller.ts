import { db } from '../config/firebase';
import { Request, Response } from 'express';

const usersRef = db.collection('users');

const compare = (a: any, b: any) => {
    if (a.superLike < b.superLike) {
        return 1;
    }
    if (a.superLike > b.superLike) {
        return -1;
    }
    return 0;
};

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
                const list = results.map(user => {
                    return {
                        userId: user.userId,
                        ...user.data,
                    };
                });
                res.status(200).json(list);
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
        .limit(11)
        .get()
        .then(users => {
            const results: {
                userId: string;
                data: FirebaseFirestore.DocumentData;
            }[] = [];
            const indexUser = users.docs.findIndex(user => user.id === req.params.userId);
            if (indexUser >= 0) {
                users.docs.splice(indexUser, 1);
            } else {
                users.docs.splice(users.docs.length, 1);
            }
            users.forEach(user => results.push({ userId: user.id, data: user.data() }));
            if (results.length) {
                const list = results.map(user => {
                    return {
                        userId: user.userId,
                        ...user.data,
                    };
                });
                res.status(200).json(list.sort(compare));
            } else {
                res.status(404).json({ detail: 'No records found' });
            }
        })
        .catch(err => {
            res.status(500).json(err);
        });
};

export const getUsersIgnored = async (req: Request, res: Response) => {
    await usersRef
        .where('ignoredYou', 'array-contains', req.params.userId)
        .get()
        .then(users => {
            const results: {
                userId: string;
                data: FirebaseFirestore.DocumentData;
            }[] = [];
            users.forEach(user => results.push({ userId: user.id, data: user.data() }));
            if (results.length) {
                const list = results.map(user => {
                    return {
                        userId: user.userId,
                        ...user.data,
                    };
                });
                res.status(200).json(list);
            } else {
                res.status(404).json({ detail: 'No records found' });
            }
        })
        .catch(err => {
            res.status(500).json(err);
        });
};

export const getUsersBlock = async (req: Request, res: Response) => {
    await usersRef
        .where('blockedYou', 'array-contains', req.params.userId)
        .get()
        .then(users => {
            const results: {
                userId: string;
                data: FirebaseFirestore.DocumentData;
            }[] = [];
            users.forEach(user => results.push({ userId: user.id, data: user.data() }));
            if (results.length) {
                const list = results.map(user => {
                    return {
                        userId: user.userId,
                        ...user.data,
                    };
                });
                res.status(200).json(list);
            } else {
                res.status(404).json({ detail: 'No records found' });
            }
        })
        .catch(err => {
            res.status(500).json(err);
        });
};
