class ErrorHandler extends Error{
    constructor(statusCode,message,stack,errors=[]){
        super(message)
        this.statusCode=statusCode;
        this.message=message;
        this.stack=stack;
        this.errors=errors;

    }
}

export default ErrorHandler;