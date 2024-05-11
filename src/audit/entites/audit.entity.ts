import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { UserEntity } from '../../auth/entities/user.entity';
import { CvEntity } from '../../cvs/entities/cv.entity';

@Entity("audit")
export class AuditEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  action: string;

  @Column()
  dateTime: Date;


  @Column()
  userId: string;


  @Column()
  cvId: string;

  @Column('varchar', { length: 1024 }) // Augmentez la valeur ici selon vos besoins
  previousData: string
}