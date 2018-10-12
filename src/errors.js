class BlackfishError extends Error {}
class BlackfishCliError extends Error {}
class BlackfishShutdown extends Error {}

module.exports = {
  BlackfishError,
  BlackfishCliError,
  BlackfishShutdown
}
