import { registerRouteComponent } from '@vendure/admin-ui/core';

import { VideoListComponent } from './components/video-list/video-list.component';

export default [
    registerRouteComponent({
        path: '',
        component: VideoListComponent,
        breadcrumb: 'Videos',
    }),
]
