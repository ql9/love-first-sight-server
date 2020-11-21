import { db } from '../config/firebase';
import { Request, Response } from 'express';
import { InformationConversion } from '../models/conversation.model';

const conversationsRef = db.collection('conversations');

function compare(a: any, b: any) {
    if (a.lastModified < b.lastModified) {
        return -1;
    }
    if (a.lastModified > b.lastModified) {
        return 1;
    }
    return 0;
}

function splitName(name: string) {
    return name.split(/[, ]+/).pop();
}

export const get = async (req: Request, res: Response) => {
    await conversationsRef
        .where('participants', 'array-contains', req.params.userId)
        .get()
        .then(cons => {
            const results: InformationConversion[] = [];
            cons.forEach(async con => {
                await conversationsRef
                    .doc(con.id)
                    .collection('messages')
                    .orderBy('createdAt', 'desc')
                    .limit(1)
                    .get()
                    .then(messages => {
                        const mes: FirebaseFirestore.DocumentData[] = [];
                        messages.forEach(message => {
                            mes.push(message.data());
                            console.log(message.data());
                        });
                        const users = con.data()!.users;
                        let receiver, sender;

                        if (users[0]._id === req.params.userId) {
                            receiver = users[1];
                            sender = users[0];
                            sender.name = 'You';
                        } else {
                            receiver = users[0];
                            sender = users[1];
                            sender.name = 'You';
                        }

                        if (mes[0].messageType === 'text') {
                            results.push({
                                conversationId: con.id,
                                lastModified: mes[0].createdAt,
                                text: mes[0].text,
                                name: receiver.name,
                                avatar: receiver.avatar,
                            });
                        } else if (mes[0].messageType === 'audio') {
                            results.push({
                                conversationId: con.id,
                                lastModified: mes[0].createdAt,
                                text: splitName(sender.name) + ' sent a voice message.',
                                name: receiver.name,
                                avatar: receiver.avatar,
                            });
                        } else {
                            results.push({
                                conversationId: con.id,
                                lastModified: mes[0].createdAt,
                                text: splitName(sender.name) + ' sent an image.',
                                name: receiver.name,
                                avatar: receiver.avatar,
                            });
                        }
                    })
                    .catch(err => console.log(err));

                const list = results.sort(compare);
                res.status(200).json(list);
            });
        })
        .catch(err => {
            res.status(500).json(err);
        });
};
