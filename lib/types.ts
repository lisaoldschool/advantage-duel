export type Advantage = {
  id: number;
  name: string;
  def: string;
  category: string;
  strategy: string;
  channel: string;
};

export type FounderRecord = {
  founder: string;
  finished: boolean;
  votes: Record<string, number>;
};
