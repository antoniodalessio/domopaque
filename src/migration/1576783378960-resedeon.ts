import { MigrationInterface, QueryRunner, getRepository } from "typeorm";
import { ActuatorsSeed } from '../seed/scenery_actuators-resede.seed'
import { ScenerySeed } from '../seed/scenary-resede.seed'

export class resedeon1576783378960 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {    

        const scenery_actuators = await getRepository("SceneryActuators").save(ActuatorsSeed);

        const scenerySeed: any = ScenerySeed;
        scenerySeed.actuators = scenery_actuators
        let res = await getRepository("Scenery").save(scenerySeed);
        for(let actuator of res.actuators) {
            actuator.scenery = res[0].id
            await getRepository("SceneryActuators").update({id: actuator.id}, actuator);
        }
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
            Truncate migrations;
            Truncate scenery_actuators cascade;`
        );
    }

}