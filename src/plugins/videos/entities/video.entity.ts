import {
    DeepPartial,
    HasCustomFields,
    VendureEntity,
    ID,
    CustomAssetFields
} from '@vendure/core';
import { Column, Entity } from 'typeorm';

@Entity()
export class Video extends VendureEntity implements HasCustomFields {
    constructor(input?: DeepPartial<Video>) {
        super(input);
    }

    // @Column()
    // id: ID;

    @Column()
    name: string;

    @Column()
    description: string;

    @Column()
    url: string;

    @Column()
    type: string;

    @Column(() => CustomAssetFields)
    customFields: CustomAssetFields;
}
