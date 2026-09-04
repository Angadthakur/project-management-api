const redisClient = require("../config/redis");

const rateLimiter = async (req, res, next) => {
    try {
        const ip = req.ip;

        const key = `rate_limit:${ip}`;

        const requests = await redisClient.incr(key);

        if (requests === 1) {
            await redisClient.expire(key, 60);
        }

        if (requests > 100) {
            return res.status(429).json({
                message: "Too many requests. Please try again later."
            });
        }

        next();
    } catch (error) {
        next(error);
    }
}

module.exports = rateLimiter