import { Module } from '@nestjs/common';
import { AuditService } from './audit.service';
import { AuditEntity } from './entites/audit.entity';
import { TypeOrmModule } from '@nestjs/typeorm';


@Module({
  imports: [TypeOrmModule.forFeature([AuditEntity])],
  providers: [AuditService]
})
export class AuditModule {}
