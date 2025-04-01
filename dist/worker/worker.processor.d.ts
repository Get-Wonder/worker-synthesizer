import { Job } from 'bull';
import { AwsService } from 'src/aws/aws.service';
import { RepositoryService } from 'src/repository/repository.service';
export declare class WorkerProcessor {
    private awsService;
    private repositoryService;
    constructor(awsService: AwsService, repositoryService: RepositoryService);
    render(job: Job<any>): Promise<{
        clipUrl: string;
    } | {
        error: boolean;
    }>;
}
