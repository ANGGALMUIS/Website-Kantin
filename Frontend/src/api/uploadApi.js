import api from "./axios";

export const uploadImage = async (file) => {
  const formData = new FormData();

  formData.append("image", file);

  return api.post("/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
