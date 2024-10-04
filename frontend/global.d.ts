// global.d.ts
import { Eip1193Provider } from "ethers"

declare module '@adraffy' {
    const value: any;
    export default value;
  }

declare global {
    interface Window {
        ethereum: any
    }
}