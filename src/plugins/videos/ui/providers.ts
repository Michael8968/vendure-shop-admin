import { addNavMenuSection } from '@vendure/admin-ui/core';

export default [
    addNavMenuSection({
        id: 'videos',
        label: 'Videos',
        items: [{
            id: 'videos',
            label: 'Videos',
            routerLink: ['/extensions/videos'],
            // Icon can be any of https://core.clarity.design/foundation/icons/shapes/
            icon: 'video-gallery',
        }],
    },
    // Add this section before the "catalog" section
    'assets'),
];