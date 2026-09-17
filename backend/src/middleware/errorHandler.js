const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    if (statusCode >= 500 && process.env.NODE_ENV !== "test") {
        console.error(err.stack);
    }

    res.status(statusCode).json({
        success: false,
        message: statusCode >= 500 ? "Internal Server Error" : err.message,
        error: err.message
    });
};

export default errorHandler;
