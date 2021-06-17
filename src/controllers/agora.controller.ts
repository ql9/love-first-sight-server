import { Request, Response } from 'express';
import { RtcTokenBuilder, RtcRole } from 'agora-access-token';

const role = RtcRole.PUBLISHER;

const currentTimestamp = new Date();

const privilegeExpiredTs = currentTimestamp.setDate(currentTimestamp.getDate() + 1) / 1000;

export const createKey = (req: Request, res: Response) => {
    console.log(privilegeExpiredTs);
    const { appID, appCertificate, channelName, uid } = req.body;
    try {
        res.status(200).json(RtcTokenBuilder.buildTokenWithUid(appID, appCertificate, channelName, uid, role, privilegeExpiredTs));
    } catch (error) {
        console.log('err: ', error);
        res.status(500).json(error);
    }
};
