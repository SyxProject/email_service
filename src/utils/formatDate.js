module.exports = function formatDate(date) {
  return new Date(date).toLocaleString("es-CO", {
    timeZone: "America/Bogota"
  })
}
