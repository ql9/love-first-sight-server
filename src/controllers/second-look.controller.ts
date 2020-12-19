import { db, FieldValue } from '../config/firebase';
import { Request, Response } from 'express';
import { createConversion } from './match.controller';

const usersRef = db.collection('users');

export const like = async (req: Request, res: Response) => {
    const { userId, userIdBeLiked } = req.params;
    await usersRef
        .doc(userIdBeLiked)
        .update({
            ignoredYou: FieldValue.arrayRemove(userId),
        })
        .then(async user => {
            await usersRef.doc(userId).update({
                likedUsers: FieldValue.arrayUnion(userIdBeLiked),
            });
            createConversion(userId, userIdBeLiked);
            res.status(204).json(user);
        })
        .catch(err => {
            res.status(500).json(err);
        });
};

export const ignore = async (req: Request, res: Response) => {
    const { userId, userIdBeIgnored } = req.params;
    await usersRef
        .doc(userIdBeIgnored)
        .update({
            ignoredYou: FieldValue.arrayRemove(userId),
            blockedYou: FieldValue.arrayUnion(userId),
        })
        .then(user => {
            res.status(204).json(user);
        })
        .catch(err => {
            res.status(500).json(err);
        });
};

export const superLike = async (req: Request, res: Response) => {
    const { userId, userIdBeSuperLiked } = req.params;
    await usersRef
        .doc(userIdBeSuperLiked)
        .update({
            superLike: FieldValue.increment(1),
            ignoredYou: FieldValue.arrayRemove(userId),
        })
        .then(async user => {
            await usersRef.doc(userId).update({
                likedUsers: FieldValue.arrayUnion(userIdBeSuperLiked),
            });
            createConversion(userId, userIdBeSuperLiked);
            res.status(204).json(user);
        })
        .catch(err => {
            res.status(500).json(err);
        });
};
