import express, { Request, Response } from "express";
import { currentUser } from "@yhticketing/common";

const route = express.Router();

route.get('/api/users/currentuser', currentUser, (req: Request, res: Response) => {
    res.send({ currentUser: req.currentUser || null });
});

export { route as currentUserRoute };