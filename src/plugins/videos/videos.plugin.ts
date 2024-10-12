import * as path from 'path';
import { AdminUiExtension } from '@vendure/ui-devkit/compiler';
import { PluginCommonModule, Type, VendurePlugin } from '@vendure/core';

import { VIDEOS_PLUGIN_OPTIONS } from './constants';
import { PluginInitOptions } from './types';
import { Video } from './entities/video.entity';
import { VideoService } from './services/video.service';
import { VideoAdminResolver } from './api/video-admin.resolver';
import { adminApiExtensions } from './api/api-extensions';
@VendurePlugin({
    imports: [PluginCommonModule],
    providers: [{ provide: VIDEOS_PLUGIN_OPTIONS, useFactory: () => VideosPlugin.options }, VideoService],
    configuration: config => {
        // Plugin-specific configuration
        // such as custom fields, custom permissions,
        // strategies etc. can be configured here by
        // modifying the `config` object.
        return config;
    },
    compatibility: '^3.0.0',
    entities: [Video],
    adminApiExtensions: {
        schema: adminApiExtensions,
        resolvers: [VideoAdminResolver, VideoAdminResolver]
    },
})
export class VideosPlugin {
    static options: PluginInitOptions;

    static init(options: PluginInitOptions): Type<VideosPlugin> {
        this.options = options;
        return VideosPlugin;
    }

    static ui: AdminUiExtension = {
        id: 'videos-ui',
        extensionPath: path.join(__dirname, 'ui'),
        routes: [{ route: 'videos', filePath: 'routes.ts' }],
        providers: ['providers.ts'],
    };
}
