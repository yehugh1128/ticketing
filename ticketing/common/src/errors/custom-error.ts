export abstract class CustomError extends Error {
    abstract statusCode: number;

    constructor(message: string) {
        //message参数方面做一些日志方面的处理，throw new Error('request error')
        super(message);

        //因为我们正在扩展一个内置类Error，所以加上这一行
        Object.setPrototypeOf(this, CustomError.prototype);
    }

    abstract serializeErrors(): { message: string, field?: string }[]
}