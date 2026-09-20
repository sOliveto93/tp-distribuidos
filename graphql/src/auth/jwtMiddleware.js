import jwt from "jsonwebtoken";

export function jwtMiddleware(req, res, next) {

    const authHeader = req.headers.authorization;

    //console.log("Authorization:", authHeader);

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        req.user = null;
        next();
        return;
    }

    const token = authHeader.substring(7);

    try {
        const payload = jwt.verify(
            token,
            process.env.JWT_SECRET,
            {
                algorithms: ["HS256"]
            }
        );

        //console.log("Payload:", payload);

        req.user = {
            email: payload.sub,
            rol: payload.role
        };

      
    } catch (error) {
        console.log("ERROR JWT:", error.message);
        req.user = null;
    }

    next();
}