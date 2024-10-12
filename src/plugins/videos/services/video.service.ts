import { Inject, Injectable } from '@nestjs/common';
import { DeletionResponse, DeletionResult } from '@vendure/common/lib/generated-types';
import { ID, PaginatedList } from '@vendure/common/lib/shared-types';
import {
    CustomFieldRelationService,
    ListQueryBuilder,
    ListQueryOptions,
    RelationPaths,
    RequestContext,
    TransactionalConnection,
    assertFound,
    patchEntity,
    CustomAssetFields
} from '@vendure/core';
import { VIDEOS_PLUGIN_OPTIONS } from '../constants';
import { Video } from '../entities/video.entity';
import { PluginInitOptions } from '../types';

@Injectable()
export class VideoService {
    constructor(
        private connection: TransactionalConnection,
        private listQueryBuilder: ListQueryBuilder,
        private customFieldRelationService: CustomFieldRelationService,
        @Inject(VIDEOS_PLUGIN_OPTIONS) private options: PluginInitOptions
    ) {}

    findAll(
        ctx: RequestContext,
        options?: ListQueryOptions<Video>,
        relations?: RelationPaths<Video>,
    ): Promise<PaginatedList<Video>> {
        return this.listQueryBuilder
            .build(Video, options, {
                relations,
                ctx,
            })
            .getManyAndCount()
            .then(([items, totalItems]) => ({
                items,
                totalItems,
            }));
    }

    findOne(
        ctx: RequestContext,
        videoId: ID,
        relations?: RelationPaths<Video>,
    ): Promise<Video | null> {
        return this.connection
            .getRepository(ctx, Video)
            .findOne({
                where: { id: videoId },
                relations,
            });
    }

    async create(ctx: RequestContext, input: CreateVideoInput): Promise<Video> {
        const newVideo = await this.connection.getRepository(Video).save(new Video(input));
        await this.customFieldRelationService.updateRelations(ctx, Video, input, newVideo);
        return newVideo;
    }

    async update(ctx: RequestContext, input: UpdateVideoInput): Promise<Video> {
        const video = await this.connection.getRepository(ctx, Video).findOne({
            where: { id: input.id },
        });
        if (!video) {
            throw new Error(`Video with id ${input.id} not found`);
        }
        const updatedVideo = await this.connection.getRepository(Video).save(new Video(input));
        await this.customFieldRelationService.updateRelations(ctx, Video, input, updatedVideo);
        return updatedVideo;
    }

    async delete(ctx: RequestContext, videoId: ID): Promise<DeletionResponse> {
        const video = await this.connection.getEntityOrThrow(ctx, Video, videoId);
        try {
            await this.connection.getRepository(ctx, Video).remove(video);
            return {
                result: DeletionResult.DELETED,
            };
        } catch (e: any) {
            return {
                result: DeletionResult.NOT_DELETED,
                message: e.message,
            };
        }
    }
}

interface CreateVideoInput {
    name: string;
    description: string;
    url: string;
    type: string;
    customFields?: CustomAssetFields;
}

interface UpdateVideoInput {
    id: ID;
    name: string;
    description: string;
    url: string;
    type: string;
    customFields?: CustomAssetFields;
}
