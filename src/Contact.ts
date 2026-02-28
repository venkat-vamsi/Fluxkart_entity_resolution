import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export enum LinkPrecedence {
    PRIMARY = "primary",
    SECONDARY = "secondary"
}

@Entity()
export class Contact {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ nullable: true })
    phoneNumber?: string;

    @Column({ nullable: true })
    email?: string;

    @Column({ nullable: true })
    linkedId?: number;
    @Column({
        type: "enum",
        enum: LinkPrecedence,
        default: LinkPrecedence.PRIMARY
    })
    linkPrecedence!: LinkPrecedence;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    @DeleteDateColumn({ nullable: true })
    deletedAt?: Date;
}