import {Request,Response,NextFunction} from "express";
import {IComments} from "../types/comments.types";
import {ITokenPayload} from "../types/token.types";
import {commentsService} from "../services/comments.service";
import {Comments} from "../models/Comments.model";

class CommentsController{
    public async create(req:Request,res:Response,next:NextFunction):Promise<Response<IComments>>{
        try {
            const {_id} = req.res.locals.jwtPayload as ITokenPayload;
            const {clothesId} = req.params
            const comment = await commentsService.create(req.body,_id,clothesId);

            return res.status(201).json(comment);
        }catch (e) {
            next(e)
        }
    }

    public async getById(req:Request,res:Response,next:NextFunction):Promise<Response<IComments>>{
        try {
            const {comments,jwtPayload,clothes} = res.locals;
            const comment = await commentsService.getCommentsById(comments._id,jwtPayload._id,clothes._id);
            return res.json(comment)
        }catch (e) {
            next(e)
        }
    }

    public async update(req:Request,res:Response,next:NextFunction):Promise<Response<IComments>>{
        try {
            const {commentId} = req.params;

            const updatedComment = await Comments.findByIdAndUpdate(
                commentId,
                {...req.body},
                {new:true}
            );

            return res.status(201).json(updatedComment);
        }catch (e) {
            next(e)
        }
    }

    public async delete(req:Request,res:Response,next:NextFunction):Promise<Response<void>>{
        try {
            const {commentId} = req.params;

            await Comments.deleteOne({_id:commentId});

            return res.sendStatus(204);
        }catch (e) {
            next(e)
        }
    }
}

export const commentsController = new CommentsController()