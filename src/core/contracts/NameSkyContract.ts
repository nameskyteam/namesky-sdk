import { NameSkyRunner } from '../NameSkyRunner';

export abstract class NameSkyContract {
  contractId: string;
  runner: NameSkyRunner;

  constructor(contractId: string, runner: NameSkyRunner) {
    this.contractId = contractId;
    this.runner = runner;
  }
}
