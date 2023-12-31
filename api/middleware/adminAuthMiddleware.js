import Admin from "../models/adminModel.js";
import { promisify } from "util";
import jwt from "jsonwebtoken";

const authenticateAdminAPIToken = async (req, res, next) => {
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
        const currentUser = await Admin.findOne({
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


const authMiddleware = {
    authenticateAdminAPIToken,
}
export default authMiddleware
