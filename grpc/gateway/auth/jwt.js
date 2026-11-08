const jwt =require("jsonwebtoken");

function jwtMiddleware(req, res, next) {

    const authHeader = req.headers.authorization;


    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Token no proporcionado" });
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

       

        req.user = {
            email: payload.sub,
            rol: payload.role
        };

      
    } catch (error) {
        return res.status(401).json({ error: "Token inválido o expirado" });
    }

    next();
}
module.exports = { jwtMiddleware };