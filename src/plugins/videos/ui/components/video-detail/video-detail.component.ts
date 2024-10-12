import { ChangeDetectionStrategy, Component, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import {
    DataService,
    NotificationService,
    TypedBaseDetailComponent,
    SharedModule,
} from '@vendure/admin-ui/core';
import { gql } from 'apollo-angular';

const GET_VIDEO = gql`
    query GetVideo($id: ID!) {
        video(id: $id) {
            id
            createdAt
            updatedAt
            title
            url
            thumbnailUrl
        }
    }
`;

@Component({
    selector: 'video-detail',
    templateUrl: './video-detail.component.html',
    styleUrls: ['./video-detail.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [SharedModule],
})
export class VideoDetailComponent extends TypedBaseDetailComponent<typeof GET_VIDEO, 'video'> {
    detailForm = this.formBuilder.group({
        name: ['', Validators.required],
        description: [''],
        url: ['', Validators.required],
        type: ['', Validators.required],
    });
    changeDetector: ChangeDetectorRef;

    constructor(
        private formBuilder: FormBuilder,
        protected dataService: DataService,
        protected notificationService: NotificationService
    ) {
        super();
        this.init();
    }

    protected setFormValues(entity: NonNullable<typeof GET_VIDEO['video']>): void {
        this.detailForm.patchValue({
            name: entity.title,
            description: '', // There's no description field in the GET_VIDEO query
            url: entity.url,
            type: entity.type,
        });
    }

    create() {
        if (this.detailForm.invalid) {
            return;
        }
        const formValue = this.detailForm.value;
        const input = {
            name: formValue.name ?? '',
            description: formValue.description ?? '',
            url: formValue.url ?? '',
            type: formValue.type ?? '',
        };
        this.dataService.mutate(this.createVideoMutation, { input }).subscribe(
            () => {
                this.notificationService.success('common.notify-create-success', { entity: 'Video' });
                this.detailForm.markAsPristine();
                this.changeDetector.markForCheck();
                this.router.navigate(['../', this.id], {
                    relativeTo: this.route,
                });
            },
            (err) => {
                this.notificationService.error('common.notify-create-error', { entity: 'Video' });
            }
        );
    }

    save() {
        if (this.detailForm.invalid || this.detailForm.pristine) {
            return;
        }
        const formValue = this.detailForm.value;
        const input = {
            id: this.id,
            name: formValue.name ?? '',
            description: formValue.description ?? '',
            url: formValue.url ?? '',
            type: formValue.type ?? '',
        };
        this.dataService.mutate(this.updateVideoMutation, { input }).subscribe(
            () => {
                this.notificationService.success('common.notify-update-success', { entity: 'Video' });
                this.detailForm.markAsPristine();
                this.changeDetector.markForCheck();
            },
            (err) => {
                this.notificationService.error('common.notify-update-error', { entity: 'Video' });
            }
        );
    }

    private createVideoMutation = gql`
        mutation CreateVideo($input: CreateVideoInput!) {
            createVideo(input: $input) {
                id
                name
            }
        }
    `;

    private updateVideoMutation = gql`
        mutation UpdateVideo($input: UpdateVideoInput!) {
            updateVideo(input: $input) {
                id
                name
            }
        }
    `;
}
