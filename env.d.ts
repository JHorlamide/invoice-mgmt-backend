declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT: string;
      HOST: string;
      NODE_ENV: string;
    }
  }
}

export {}
