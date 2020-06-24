// nem talált oldalakra használjunk másik sablont
// vigyázat hogy ez a middleware a lánc VÉGÉRE kerüljön
module.exports = (req, res) => {
  // kirajzoljuk a hibaoldalunk sablonját
  res.status(404).render('error', { status: 404, message: 'The requested endpoint is not found' });
};
