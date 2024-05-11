// audit.service.ts
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditEntity } from './entites/audit.entity';
import { CvEvent } from '../events/cv.events';

@Injectable()
export class AuditService {
  constructor(
    @InjectRepository(AuditEntity)
    private auditRepository: Repository<AuditEntity>,
  ) {}

  @OnEvent('cv.created')
  async handleCvCreatedEvent(event: CvEvent) {
    const audit = this.auditRepository.create({
      action: 'CREATE',
      dateTime: new Date(),
      userId: event.userId,
      cvId: event.cvId,
      previousData: " "
    });
    await this.auditRepository.save(audit);
  }

  @OnEvent('cv.deleted')
  async handleCvDeletedEvent(event: CvEvent) {
    const audit = this.auditRepository.create({
      action: 'Delete',
      dateTime: new Date(),
      userId: event.userId,
      cvId: event.cvId,
      previousData: event.oldCv
    });
    await this.auditRepository.save(audit);
  }
  @OnEvent('cv.updated')
  async handleCvUpdatedEvent(event: CvEvent) {
    const audit = this.auditRepository.create({
      action: 'Update',
      dateTime: new Date(),
      userId: event.userId,
      cvId: event.cvId,
      previousData: event.oldCv
    });
    await this.auditRepository.save(audit);
  }
  @OnEvent('cv.recovered')
  async handleCvRecoverEvent(event: CvEvent) {
    const audit = this.auditRepository.create({
      action: 'Recover',
      dateTime: new Date(),
      userId: event.userId,
      cvId: event.cvId,
      previousData: event.oldCv
    });
    await this.auditRepository.save(audit);
  }



}