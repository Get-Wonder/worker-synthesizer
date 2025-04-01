export declare class AwsService {
    private bucketName;
    private doSpacesEndpoint;
    constructor();
    parseS3Url(url: string): {
        bucket: string;
        key: string;
        query: string;
    };
    downloadFile(url: string, dest: string): Promise<any>;
    private streamToBuffer;
    uploadJingle(file: any, options?: {
        acl?: string;
    }): Promise<any>;
    uploadWonderchatVideo(file: any, chatbotId: string, options?: {
        acl?: string;
    }): Promise<any>;
    private getS3;
}
