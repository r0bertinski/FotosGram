

export interface FileUpload {
    size: string,
    name: string;
    data: any,
    encoding: string,
    tempFilePath: string,
    truncated: boolean,
    mimetype: string,

    mv: Function;
};