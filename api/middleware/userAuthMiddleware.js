import User from "../models/userModel.js";
import { promisify } from "util";
import jwt from "jsonwebtoken";

const authenticateUserAPIToken = async (req, res, next) => {
    try {
        let token;
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer")
        ) {
            token = req.headers["authorization"].split(" ")[1];
        }
        console.log(token);
        if (!token) {
            return res.status(401).json({
                succeded: false,
                error: "User not authenticated",
            });
        }

        const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
        console.log(decoded);
        const currentUser = await User.findOne({
            where: {
                id: decoded.id,
            }
        });
        console.log(currentUser);
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


const authMiddleware = {
    authenticateUserAPIToken,
}
export default authMiddleware
