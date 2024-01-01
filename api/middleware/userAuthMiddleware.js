import User from "../models/userModel.js";
import { promisify } from "util";
import jwt from "jsonwebtoken";
import Shares from "../models/sharesModel.js"
const authenticateUserAPIToken = async (req, res, next) => {
    try {
        let token;
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer")
        ) {
            token = req.headers["authorization"].split(" ")[1];
        }
        if (!token) {
            return res.status(401).json({
                succeded: false,
                error: "User not authenticated",
            });
        }

        const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
        const currentUser = await User.findOne({
            where: {
                id: decoded.id,
            }
        });
        if (!currentUser) {
            return res.status(401).json({
                succeded: false,
                error: "User not authenticated",
            });
        } else {
            req.user = currentUser
        }
        next()

    } catch (err) {
        return res.status(401).json({
            succeded: false,
            error: err,
        });
    }
};
const isSharesOwnerMiddleware = async (req, res, next) => {
    try {
        const userId = req.user.id
        const shareId = Number(req.params.id);
        const isUserOwner = await Shares.findOne({
            where: {
                user_id: userId,
                id: shareId,
            },
        });
        if (!isUserOwner) {
            return res.status(422).json({
                succedd: false,
                data: {
                    message: 'Bu hisseye erişim izniniz yok.'
                }
            });
        }
        next()
    } catch (error) {
        res.status(500).json({
            succedd: false,
            data:{
                error,
                message: 'Middleware hatası.'
            }
        });
    }
}

const authMiddleware = {
    authenticateUserAPIToken,
    isSharesOwnerMiddleware
}
export default authMiddleware
