export const errorMiddleware=(err,req,res,next)=>{

    err.message = err.message || "galat request kar diye"
    err.statuscode=err.statuscode || 400

    res.status(err.statuscode).json({
        error:err.message 
    })
}