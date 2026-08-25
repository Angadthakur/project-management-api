const validate = (schema) => {
    return (req,res,next) => {
        const result = schema.safeParse(req.body);

        if(!result.success){
            return res.status(400).json({
                success:false,
                message : "Validation failed",
                error: result.error.issues.map((issues)=> ({
                    field: issues.path[0],
                    message : issues.message,
                })),
            });
        }

        req.body = result.data;

        next();
    }
}

module.exports = validate;