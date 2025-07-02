import path from 'path';
import dotenv from 'dotenv';
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

import bcrypt from 'bcrypt';
import { connectToDatabase } from '../utils/db';
import { User } from '../models/User';

async function seedAdmin() {
  await connectToDatabase();

  const adminEmail = 'admin@streamfutbol.com';

  const existing = await User.findOne({ email: adminEmail });
  if (!existing) {
    const hashed = await bcrypt.hash('AdminPass123', 10);
    await User.create({
      email: adminEmail,
      passwordHash: hashed,
      role: 'admin',
    });
  }

  process.exit(0);
}

seedAdmin().catch(() => process.exit(1));
