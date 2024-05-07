import { MiddlewareConsumer, Module } from '@nestjs/common';
import { CvsService } from './cvs.service';
import { CvsController } from './cvs.controller';
import { CvEntity } from './entities/cv.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CvsV2Controller } from './cvs.v2.controller';
import { AuthMiddleware } from '../auth/auth.middleware';
import { AuthModule } from '../auth/auth.module';
import { AuditModule } from '../audit/audit.module';
import { AuditEntity } from '../audit/entites/audit.entity';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [TypeOrmModule.forFeature([CvEntity,AuditEntity]), AuthModule,AuditModule,EventEmitterModule],
  controllers: [CvsController, CvsV2Controller],
  providers: [CvsService],
})
export class CvsModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(CvsV2Controller);
  }
}
