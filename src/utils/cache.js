const redisClient = require("../config/redis")

const invalidateProjectTaskCache = async (projectId) => {
    try {
        const pattern = `project:${projectId}:tasks:*`

        const keys = await redisClient.keys(pattern)

        if (keys.length > 0) {
            await redisClient.del(keys)
        }
    } catch (error) {
        console.error("Redis cache invalidation failed:", error.message);
    }
}

module.exports = invalidateProjectTaskCache