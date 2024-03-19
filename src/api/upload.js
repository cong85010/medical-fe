import { instance } from ".";

const baseURL = "file";

export const uploadFile = (file) => {
  return instance.post(
    `${baseURL}/upload`,
    {
      file,
    },
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
};

export const uploadFiles = (files) => {
  if (files.length === 1) {
    return uploadFile(files[0]);
  }
  return instance.post(
    `${baseURL}/uploads`,
    {
      files,
    },
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
};
