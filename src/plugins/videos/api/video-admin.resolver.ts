import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { DeletionResponse, Permission } from '@vendure/common/lib/generated-types';
import { CustomFieldsObject } from '@vendure/common/lib/shared-types';
import {
    Allow,
    Ctx,
    ID,
    ListQueryOptions,
    PaginatedList,
    RelationPaths,
    Relations,
    RequestContext,
    Transaction
} from '@vendure/core';
import { Video } from '../entities/video.entity';
import { VideoService } from '../services/video.service';

// These can be replaced by generated types if you set up code generation
interface CreateVideoInput {
    name: string;
    description: string;
    url: string;
    type: string;
}

interface UpdateVideoInput {
    id: ID;
    name: string;
    description: string;
    url: string;
    type: string;
}

@Resolver()
export class VideoAdminResolver {
    constructor(private videoService: VideoService) {}

    @Query()
    @Allow(Permission.SuperAdmin)
    async video(
        @Ctx() ctx: RequestContext,
        @Args() args: { id: ID },
        @Relations(Video) relations: RelationPaths<Video>,
    ): Promise<Video | null> {
        return this.videoService.findOne(ctx, args.id, relations);
    }

    @Query()
    @Allow(Permission.SuperAdmin)
    async videos(
        @Ctx() ctx: RequestContext,
        @Args() args: { options: ListQueryOptions<Video> },
        @Relations(Video) relations: RelationPaths<Video>,
    ): Promise<PaginatedList<Video>> {
        return this.videoService.findAll(ctx, args.options || undefined, relations);
    }

    @Mutation()
    @Transaction()
    @Allow(Permission.SuperAdmin)
    async createVideo(
        @Ctx() ctx: RequestContext,
        @Args() args: { input: CreateVideoInput },
    ): Promise<Video> {
        return this.videoService.create(ctx, args.input);
    }

    @Mutation()
    @Transaction()
    @Allow(Permission.SuperAdmin)
    async updateVideo(
        @Ctx() ctx: RequestContext,
        @Args() args: { input: UpdateVideoInput },
    ): Promise<Video> {
        return this.videoService.update(ctx, args.input);
    }

    @Mutation()
    @Transaction()
    @Allow(Permission.SuperAdmin)
    async deleteVideo(@Ctx() ctx: RequestContext, @Args() args: { id: ID }): Promise<DeletionResponse> {
        return this.videoService.delete(ctx, args.id);
    }
}
