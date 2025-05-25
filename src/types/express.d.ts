import { User } from "../models/models";

// Extend Express Request type
declare global {
    namespace Express {
      interface Request {
        user?: {
          _id: string;
          matricNumber: string;
          isAdmin: boolean;
          email?:string | any
        };
      }
    }
  }