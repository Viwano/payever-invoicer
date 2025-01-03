import { Module } from '@nestjs/common';
import { AppController } from '../controllers/app.controller';
import { AppService } from '../services/app.service';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/payever_invoicer_db'),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
