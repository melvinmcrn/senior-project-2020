import httpClient from "./httpClient";

interface ValidationResponseData {
  image_id: string;
}

interface ResultResponseData {
  result: null | "PASS" | "BAN" | "UNCERTAIN";
}

interface GetUncertainResponseData {
  images: {
    imageId: string;
    imageUrl: string;
  }[];
}

interface UpdateUncertainRequestData {
  imageId: string;
  status: string;
}

interface UpdateUncertainResponseData {
  success_images: string[];
  failed_images: string[];
}

export const validateImage = (image_url: string) => {
  const data = {
    image_url,
  };
  return httpClient
    .post<ValidationResponseData>("/validation", data)
    .then((response) => {
      if (response.status === 200 && response.data.image_id) {
        return response.data.image_id;
      }
      throw Error("Response has no data");
    });
};

export const getResult = (image_id: string) => {
  const params = {
    image_id,
  };
  return httpClient
    .get<ResultResponseData>("/result", { params })
    .then((response) => {
      if (response.status === 200) {
        return response.data.result;
      }
    });
};

export const getUncertainImage = () => {
  return httpClient
    .get<GetUncertainResponseData>("/uncertain_list")
    .then((response) => {
      if (response.status === 200 && response.data.images) {
        return response.data.images;
      }
      throw Error("Response has no data");
    });
};

export const updateUncertainImage = (data: UpdateUncertainRequestData[]) => {
  const body = {
    data,
  };
  return httpClient
    .post<UpdateUncertainResponseData>("/update_uncertain", body)
    .then((response) => {
      if (response.status === 200) {
        return response.data;
      }
      throw Error("Response has no data");
    });
};
