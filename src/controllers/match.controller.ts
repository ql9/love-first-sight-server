import { db, FieldValue } from '../config/firebase';
import { Request, Response } from 'express';
import { Filter } from '../models/filer.model';

const usersRef = db.collection('users');

function getDistance(coordinates1: { lat: number; long: number }, coordinates2: { lat: number; long: number }) {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(coordinates2.lat - coordinates1.lat); // deg2rad below
    const dLon = deg2rad(coordinates2.long - coordinates1.long); // deg2radlon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(coordinates1.long)) * Math.cos(deg2rad(coordinates2.lat)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return d;
}

function deg2rad(deg: number) {
    return deg * (Math.PI / 180);
}

function computeAge(birthday: string) {
    const diff = Date.now() - Date.parse(birthday);
    const ageDate = new Date(diff);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
}

export const get = async (req: Request, res: Response) => {
    const filter = req.body as Filter;

    const currentUser = await usersRef.doc(filter.userId).get();
    // const previousUser = await usersRef.doc(filter.preUserId).get();

    await usersRef
        .where('availableUsers', 'array-contains', filter.userId)
        // .orderBy('createAt')
        // .startAfter(previousUser)
        .limit(100)
        .get()
        .then(users => {
            let results: {
                userId: string;
                data: FirebaseFirestore.DocumentData;
            }[] = [];
            users.forEach(user => results.push({ userId: user.id, data: user.data() }));

            if (filter.gender) {
                results = results.filter(result => result.data.gender === filter.gender);
            }
            if (filter.distance) {
                results = results.filter(function (result) {
                    return getDistance(result.data.coordinates, currentUser.data()!.coordinates) <= filter.distance;
                });
            }
            if (filter.age) {
                results = results.filter(function (result) {
                    return filter.age.from <= computeAge(result.data.birthday) && computeAge(result.data.birthday) <= filter.age.to;
                });
            }
            if (filter.height) {
                results = results.filter(function (result) {
                    if (result.data.height) {
                        return filter.height.from <= result.data.height && result.data.height <= filter.height.to;
                    }
                    return true;
                });
            }
            if (filter.lookingFor) {
                results = results.filter(function (result) {
                    if (result.data.lookingFor) {
                        return result.data.lookingFor === filter.lookingFor;
                    }
                    return true;
                });
            }
            if (filter.drinking) {
                results = results.filter(function (result) {
                    if (result.data.drinking) {
                        return result.data.drinking === filter.drinking;
                    }
                    return true;
                });
            }
            if (filter.smoking) {
                results = results.filter(function (result) {
                    if (result.data.smoking) {
                        return result.data.smoking === filter.smoking;
                    }
                    return true;
                });
            }
            if (filter.kids) {
                results = results.filter(function (result) {
                    if (result.data.kids) {
                        return result.data.kids === filter.kids;
                    }
                    return true;
                });
            }
            if (filter.from) {
                results = results.filter(function (result) {
                    if (result.data.from) {
                        return result.data.from === filter.from;
                    }
                    return true;
                });
            }
            if (filter.university) {
                results = results.filter(function (result) {
                    if (result.data.university) {
                        return result.data.university === filter.university;
                    }
                    return true;
                });
            }
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

export const like = async (req: Request, res: Response) => {
    const isLike = await usersRef
        .doc(req.params.userIdBeLiked)
        .get()
        .then(user => {
            let flag = false;
            if (user.data()!.youLiked) {
                user.data()!.youLiked.forEach((uid: string) => {
                    if (uid === req.params.userId) {
                        flag = true;
                    }
                });
            }
            return flag;
        });

    await usersRef
        .doc(req.params.userId)
        .update({
            youLiked: FieldValue.arrayUnion(req.params.userIdBeLiked),
            availableUsers: FieldValue.arrayRemove(req.params.userIdBeLiked),
        })
        .then(async () => {
            if (isLike) {
                await usersRef.doc(req.params.userId).update({
                    matches: FieldValue.arrayUnion(req.params.userIdBeLiked),
                });
                await usersRef.doc(req.params.userIdBeLiked).update({
                    matches: FieldValue.arrayUnion(req.params.userId),
                });
            }
            res.status(204).json('liked');
        })
        .catch(err => {
            res.status(500).json(err);
        });
};

export const ignore = async (req: Request, res: Response) => {
    await usersRef
        .doc(req.params.userId)
        .update({
            availableUsers: FieldValue.arrayRemove(req.params.userIdBeIgnored),
            ignoredUsers: FieldValue.arrayUnion(req.params.userIdBeIgnored),
        })
        .then(user => {
            res.status(204).json(user);
        })
        .catch(err => {
            res.status(500).json(err);
        });
};

export const report = async (req: Request, res: Response) => {
    await usersRef
        .doc(req.params.userIdBeReported)
        .update({
            report: FieldValue.increment(1),
        })
        .then(user => {
            res.status(204).json(user);
        })
        .catch(err => {
            res.status(500).json(err);
        });
};

export const superLike = async (req: Request, res: Response) => {
    await usersRef
        .doc(req.params.userId)
        .update({
            youLiked: FieldValue.arrayUnion(req.params.userIdBeSuperLiked),
            availableUsers: FieldValue.arrayRemove(req.params.userIdBeSuperLiked),
        })
        .then(async () => {
            await usersRef
                .doc(req.params.userIdBeSuperLiked)
                .update({
                    superLike: FieldValue.increment(1),
                })
                .then(user => {
                    res.status(204).json(user);
                });
        })
        .catch(err => {
            res.status(500).json(err);
        });
};
