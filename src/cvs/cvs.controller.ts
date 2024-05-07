import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UploadedFile,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import { CvsService } from './cvs.service';
import { CreateCvDto } from './dto/create-cv.dto';
import { UpdateCvDto } from './dto/update-cv.dto';
import { SearchCvDto } from './dto/search-cv.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileUploadOptions } from '../file-upload';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { User } from '../auth/user.decorator';
import { Role, UserEntity } from '../auth/entities/user.entity';
import { AdminGuard } from '../auth/admin.guard';

@Controller({
  path: 'cvs',

})
@UseGuards(JwtAuthGuard)
export class CvsController {
  constructor(private readonly cvsService: CvsService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file', fileUploadOptions))
  create(
    @Body() createCvDto: CreateCvDto,
    @User() user: UserEntity,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    createCvDto.user = user;
    createCvDto.path = file?.filename;

    return this.cvsService.createCv(createCvDto);
  }

  @Get()
  findAllBy(@Query() searchCvDto: SearchCvDto, @User() user: UserEntity) {
    const { id, role } = user;

    return this.cvsService.findAllBy(
      searchCvDto,
      role !== Role.Admin ? id : undefined,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cvsService.findOne(id, {
      skills: true,
    });
  }
  @Patch('recover/:id')
  @UseGuards(AdminGuard)
  @UseInterceptors(FileInterceptor('file', fileUploadOptions))
  recover(
    @User() user: any,
    @Param('id') id: string,


  ) {


    return this.cvsService.recoverCv(id);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('file', fileUploadOptions))
  update(
    @User() user: any,
    @Param('id') id: string,
    @Body() updateCvDto: UpdateCvDto,
    @UploadedFile() file?: Express.Multer.File,

  ) {
    updateCvDto.path = file?.filename;

    return this.cvsService.updateCv(id, updateCvDto,user);
  }

  @Delete(':id')
  remove(@Param('id') id: string,@User() user: UserEntity) {
    return this.cvsService.removeCv(id,user);
  }


}
