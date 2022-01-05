export const removeDoublicate = (data) => {
  const Ids = [...new Set(data.map((item) => item._id))];
  const notRedundency = Ids.map((id) =>
    data.find((message) => message._id === id),
  );
  return notRedundency;
};
