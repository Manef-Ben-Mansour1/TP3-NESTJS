import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CvEntity } from './entities/cv.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CrudService } from '../common/crud/crud.service';
import { DeepPartial, Like, Repository } from 'typeorm';
import { SearchCvDto } from './dto/search-cv.dto';
import { Pagination } from 'src/common/dto/pagination.dto';
import { UpdateCvDto } from './dto/update-cv.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CvEvent } from '../events/cv.events';

@Injectable()
export class CvsService extends CrudService<CvEntity> {
  constructor(
    @InjectRepository(CvEntity)
    private cvsRepository: Repository<CvEntity>,
    private eventEmitter: EventEmitter2,
  ) {
    super(cvsRepository);
  }
  async createCv(createCvDto: DeepPartial<CvEntity>): Promise<CvEntity> {
    const cv = await this.cvsRepository.save(createCvDto);

    this.eventEmitter.emit('cv.created', new CvEvent(cv.id, cv.user.id));

    return cv;
  }

  findAllBy(
    searchCvDto: SearchCvDto,
    id?: string,
  ): Promise<Pagination<CvEntity>> {
    const { age, criterion } = searchCvDto;

    const condition = id ? { user: { id } } : null;

    const where = [];

    if (age != null) {
      where.push({ age, ...condition });
    }

    if (criterion != null) {
      const like = Like(`%${criterion}%`);
      const fields: (keyof CvEntity)[] = ['firstname', 'name', 'job'];

      where.push(...fields.map((field) => ({ [field]: like, ...condition })));
    }

    if (where.length === 0 && condition) {
      where.push(condition);
    }

    return this.findAll(searchCvDto, where);
  }

  private async verifyOwnership(id: string, userId: string) {
    const cv = await this.findOne(id);

    if (cv.user.id !== userId) {
      throw new ForbiddenException();
    }
  }
  async removeCv(id: string, user: any): Promise<any> {
    const cv = await this.cvsRepository.findOne({ where: { id } });
    if (!cv) {
      throw new NotFoundException();
    }
    if (cv.user.id !== user.id) {
      throw new ForbiddenException("ce cv n'est pas le votre");
    }
    const cvRemoved = await this.cvsRepository.softRemove(cv);
    this.eventEmitter.emit('cv.deleted', new CvEvent(cv.id, cv.user.id));

    return cvRemoved;
  }

  async updateCv(
    id: string,
    updateCvDto: UpdateCvDto,
    user: any,
  ): Promise<CvEntity> {
    const cv = await this.cvsRepository.findOne({ where: { id: id } });

    if (!cv) {
      throw new NotFoundException();
    }
    if (cv.user.id !== user.id) {
      throw new ForbiddenException("ce cv n'est pas le votre");
    }
    const updatedCv = await this.cvsRepository.save({ ...cv, ...updateCvDto });
    this.eventEmitter.emit('cv.updated', new CvEvent(cv.id, cv.user.id));
    return updatedCv;
  }
  async recoverCv(id: string): Promise<CvEntity> {
    const cv = await this.cvsRepository.findOne({
      where: { id },
      withDeleted: true,
    });

    if (!cv) {
      throw new NotFoundException();
    }
    const recoveredCv = await this.cvsRepository.recover({ ...cv });
    this.eventEmitter.emit('cv.recovered', new CvEvent(cv.id, cv.user.id));
    return recoveredCv;
  }

  async updateOwned(id: string, updateCvDto: UpdateCvDto, userId: string) {
    await this.verifyOwnership(id, userId);
    return this.update(id, updateCvDto);
  }

  async removeOwned(id: string, userId: string) {
    await this.verifyOwnership(id, userId);
    return this.remove(id);
  }
}
