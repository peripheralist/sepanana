export type SepanaRecord<
  ID extends string = string,
  T extends { id: ID; _id: ID } = { id: ID; _id: ID }
> = T & { [k: string]: string | number | object | null | undefined };

export type RecordsQueryResponse = {
  hits: {
    total: {
      value: number;
      relation: string;
    };
    max_score: number;
    hits: {
      _index: string;
      _type: string;
      _id: string;
      _score: number;
      _source: SepanaRecord;
    }[];
  };
};

export type EnginesQueryResponse = {
  engine_id: string;
  engine_name: string;
  namespace: string;
  network: string;
  total_records: number;
  total_size: number;
  created_at: {
    val: string;
    _spec_type: string;
  };
};

export const restrictedKeys = ["sepana_job_id", "sepana_indexing_datetime"];
