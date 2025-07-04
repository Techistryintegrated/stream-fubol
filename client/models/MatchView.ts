import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IMatchView extends Document {
  userId: string;
  gmid: string;
  match?: string; // <-- add
  league?: string; // <-- add
  viewedAt: Date;
}

const MatchViewSchema: Schema<IMatchView> = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    gmid: { type: String, required: true },
    match: { type: String }, // <-- add
    league: { type: String }, // <-- add
    viewedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const MatchView: Model<IMatchView> =
  mongoose.models.MatchView ||
  mongoose.model<IMatchView>('MatchView', MatchViewSchema);
