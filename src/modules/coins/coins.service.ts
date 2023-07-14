import { Injectable } from '@nestjs/common';

@Injectable()
export class CoinsService {
  findAll() {
    return `This action returns all coins`;
  }

  findOne(id: number) {
    return `This action returns a #${id} coin`;
  }

  remove(id: number) {
    return `This action removes a #${id} coin`;
  }
}
