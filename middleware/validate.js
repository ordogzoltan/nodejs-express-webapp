// middleware függvény, mely megnézi hogy adattagok be vannak-e
// helyesen állítva egy hívásobjektum testén
exports.hasProps = (propNames) => (req, res, next) => {
  const nonExistentProps = propNames.filter((propName) => !(propName in req.body));

  if (nonExistentProps.length === 0) {
    next();
  } else {
    res.status(400).json({ message: `The following fields are missing: ${nonExistentProps.join(', ')}` });
  }
};
