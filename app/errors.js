class BadRequestError extends Error{
     comstructor(statusCode , message){
        super();
        this.statusCode = statusCode;
        this.message = message;
    }
 }

 class ErrorHandler {
     constructor(){
        this.HandLeError = (error, reponseStream = null) =>{
            if(reponseStream){
                reponseStream.status(error.statusCode || 500).json({
                    message: error.message || "Internal Server Error",
                })
            }else {
                console.log(error)
            }
        };
     }
 }
 
 module.exports = {
     BadRequestError,
     ErrorHandler: new ErrorHandler()
 };
   