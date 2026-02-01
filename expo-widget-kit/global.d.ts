// global.d.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
declare module "nitrogen" {
    export const NitroModules: {
      create: (options: any) => any;
    };
  }
  