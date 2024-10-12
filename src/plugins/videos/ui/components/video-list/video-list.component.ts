import { ChangeDetectionStrategy, Component } from '@angular/core';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import {
    DataService,
    ModalService,
    NotificationService,
    TypedBaseListComponent,
    SharedModule,
} from '@vendure/admin-ui/core';
import { gql } from 'apollo-angular';

const getVideoListDocument = gql(`
  query GetVideoList($options: VideoListOptions) {
    videos(options: $options) {
      items {
        id
        createdAt
        updatedAt
        name
        description
        url
        type
      }
      totalItems
    }
  }
`);

@Component({
    selector: 'vdr-video-list',
    templateUrl: './video-list.component.html',
    styleUrls: ['./video-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [SharedModule],
})
export class VideoListComponent extends TypedBaseListComponent<typeof getVideoListDocument, 'videos'> {
    readonly filters = this.createFilterCollection()
        .addIdFilter()
        .addDateFilters()
        .addFilter({
            name: 'name',
            type: {kind: 'text'},
            label: _('common.name'),
            filterField: 'name',
        })
        .connectToRoute(this.route);

    readonly sorts = this.createSortCollection()
        .defaultSort('createdAt', 'DESC')
        .addSort({ name: 'createdAt' as const })
        .addSort({ name: 'updatedAt' as const })
        .addSort({ name: 'name' as const })
        .connectToRoute(this.route);

    constructor(
        private dataService: DataService,
        private modalService: ModalService,
        private notificationService: NotificationService,
    ) {
        super();
        super.configure({
            document: getVideoListDocument,
            getItems: data => data.videos,
            setVariables: (skip, take) => ({
                options: {
                    skip,
                    take,
                    filter: {
                        name: {
                            contains: this.searchTermControl.value,
                        },
                        ...this.filters.createFilterInput(),
                    },
                    sort: this.sorts.createSortInput(),
                },
            }),
            refreshListOnChanges: [this.filters.valueChanges, this.sorts.valueChanges],
        });
    }

    deleteVideo(videoId: string) {
        this.modalService
            .dialog({
                title: _('catalog.confirm-delete-video'),
                body: _('catalog.confirm-delete-video-body'),
                buttons: [
                    { type: 'secondary', label: _('common.cancel') },
                    { type: 'danger', label: _('common.delete'), returnValue: true },
                ],
            })
            .subscribe(result => {
                if (result) {
                    this.dataService.video.deleteVideo(videoId).subscribe(
                        () => {
                            this.notificationService.success(_('common.notify-delete-success'), {
                                entity: 'Video',
                            });
                            this.refresh();
                        },
                        err => {
                            this.notificationService.error(_('common.notify-delete-error'), {
                                entity: 'Video',
                            });
                        },
                    );
                }
            });
    }
}
