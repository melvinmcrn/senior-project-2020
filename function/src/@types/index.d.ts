export interface ValidationRequestBody {
  image_url: string;
}

export enum ValidationResult {
  pass = 'PASS',
  ban = 'BAN',
  uncertain = 'UNCERTAIN',
}

export interface ValidationResultTransaction {
  id: string;
  url: string;
  predicted_result?: ValidationResult;
  actual_result?: ValidationResult;
  model_version?: string;
  create_time: Date;
  update_time: Date;
}

export interface UncertainImageList {
  imageId: string;
  imageUrl: string;
}
