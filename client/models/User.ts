// models/User.ts
import mongoose, { Document, Model, Schema } from 'mongoose';
import bcrypt from 'bcrypt';

export interface IUser extends Document {
  email: string;
  passwordHash: string;
  name?: string;
  role: 'user' | 'admin';
  resetOTP?: string;
  resetOTPExpires?: Date;
  comparePassword(candidate: string): Promise<boolean>;
}

const UserSchema: Schema<IUser> = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true },
    passwordHash: { type: String, required: true },
    name: { type: String },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    resetOTP: String,
    resetOTPExpires: Date,
  },
  { timestamps: true }
);

UserSchema.methods.comparePassword = function (candidate: string) {
  return bcrypt.compare(candidate, this.passwordHash);
};

export const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
