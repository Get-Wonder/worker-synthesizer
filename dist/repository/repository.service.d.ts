import { SceneStatus } from 'src/enums/scene-status.enum';
export declare class RepositoryService {
    private pgPool;
    constructor();
    updateScene(sceneId: string, sceneStatus: SceneStatus): Promise<void>;
    getAudio(text: string, audioGroupId: string): Promise<any>;
    getScene(sceneId: string): Promise<void>;
    createClip(text: string, audioUrl: string, fileName: string, groupId: string): Promise<void>;
}
