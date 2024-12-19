import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from '../app.controller';
import { AppService } from '../app.service'

describe("Testing", () => {

    let App : AppController;
    beforeEach(async () => {

        const module : TestingModule = await Test.createTestingModule({
            controllers : [AppController],
            providers : [AppService]
        }).compile();

        App = module.get<AppController>(AppController);
    })

    App.getCompanyProfile();



})