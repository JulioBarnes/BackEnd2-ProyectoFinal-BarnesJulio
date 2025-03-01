export function validate(dto) {
  return async (req, res, next) => {
    const { error } = dto.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    next();
  };
}
