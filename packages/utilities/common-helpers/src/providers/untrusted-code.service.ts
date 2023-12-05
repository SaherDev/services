import { VM } from 'vm2';
export class UntrustedCodeProcessor {
  static process(untrustedCode: Readonly<string>): Function {
    const vm = new VM();
    return vm.run(untrustedCode);
  }
}
