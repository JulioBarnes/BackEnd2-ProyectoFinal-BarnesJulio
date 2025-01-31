export const checkId = (req, res, next) => {
  const { id } = req.params;
  if (isNaN(id)) return res.status(404).send("Debe ingresar un ID numérico");
  next();
};
