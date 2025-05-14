/**
 * Calculate tile layout and quantities
 * @param {number} roomLength - Room length in meters
 * @param {number} roomWidth - Room width in meters
 * @param {number} tileLength - Tile length in centimeters
 * @param {number} tileWidth - Tile width in centimeters
 * @param {number} spacing - Spacing between tiles in millimeters
 * @param {string} pattern - Tile pattern (grid, brick, herringbone, diagonal)
 * @returns {object} Calculation results
 */
const calculateTiles = (roomLength, roomWidth, tileLength, tileWidth, spacing, pattern = "grid") => {
  // Convert all measurements to meters for consistency
  const tileLengthM = tileLength / 100 // Convert cm to m
  const tileWidthM = tileWidth / 100 // Convert cm to m
  const spacingM = spacing / 1000 // Convert mm to m

  // Calculate room area
  const roomArea = roomLength * roomWidth

  // Calculate tile area (including spacing)
  const tileAreaWithSpacing = (tileLengthM + spacingM) * (tileWidthM + spacingM)

  // Calculate number of tiles needed based on pattern
  let tilesNeeded, tilesAlongLength, tilesAlongWidth, wholeTiles, cutTiles, edgeTiles, cornerTiles

  switch (pattern) {
    case "brick":
      // Brick pattern calculations (tiles offset by half)
      tilesAlongLength = Math.ceil(roomLength / (tileLengthM + spacingM))
      tilesAlongWidth = Math.ceil(roomWidth / (tileWidthM + spacingM))
      tilesNeeded = Math.ceil(roomArea / tileAreaWithSpacing)

      // In brick pattern, we have more cut tiles along the edges
      wholeTiles = Math.floor(tilesAlongLength - 1) * Math.floor(tilesAlongWidth - 1)
      edgeTiles = tilesAlongLength * 2 + tilesAlongWidth * 2 - 4
      cornerTiles = 4
      cutTiles = tilesNeeded - wholeTiles
      break

    case "herringbone":
      // Herringbone pattern (tiles at 45 degrees)
      // This is a more complex pattern with more waste
      const effectiveTileSize = Math.sqrt(Math.pow(tileLengthM, 2) + Math.pow(tileWidthM, 2))
      tilesAlongLength = Math.ceil(roomLength / (effectiveTileSize * 0.7 + spacingM))
      tilesAlongWidth = Math.ceil(roomWidth / (effectiveTileSize * 0.7 + spacingM))
      tilesNeeded = Math.ceil(roomArea / (tileAreaWithSpacing * 0.85)) // 15% more tiles due to pattern

      // Herringbone has more cut tiles
      wholeTiles = Math.floor(tilesNeeded * 0.7)
      cutTiles = tilesNeeded - wholeTiles
      edgeTiles = Math.ceil((2 * (roomLength + roomWidth)) / (tileLengthM + tileWidthM) / 2)
      cornerTiles = 4
      break

    case "diagonal":
      // Diagonal pattern (tiles at 45 degrees)
      tilesAlongLength = Math.ceil(roomLength / (tileLengthM * 0.7 + spacingM))
      tilesAlongWidth = Math.ceil(roomWidth / (tileWidthM * 0.7 + spacingM))
      tilesNeeded = Math.ceil(roomArea / (tileAreaWithSpacing * 0.9)) // 10% more tiles due to pattern

      // Diagonal has more cut tiles along the edges
      wholeTiles = Math.floor(tilesNeeded * 0.75)
      cutTiles = tilesNeeded - wholeTiles
      edgeTiles = Math.ceil((2 * (roomLength + roomWidth)) / (tileLengthM + tileWidthM) / 2)
      cornerTiles = 4
      break

    case "grid":
    default:
      // Standard grid pattern
      tilesAlongLength = Math.ceil(roomLength / (tileLengthM + spacingM))
      tilesAlongWidth = Math.ceil(roomWidth / (tileWidthM + spacingM))
      tilesNeeded = Math.ceil(roomArea / tileAreaWithSpacing)

      // Calculate number of whole tiles
      wholeTiles = Math.floor(tilesAlongLength) * Math.floor(tilesAlongWidth)

      // Calculate number of cut tiles
      cutTiles = tilesNeeded - wholeTiles

      // Calculate edge tiles (tiles that need to be cut along the edges)
      edgeTiles = tilesAlongLength * 2 + tilesAlongWidth * 2 - 4

      // Calculate corner tiles (tiles that need to be cut at the corners)
      cornerTiles = 4
      break
  }

  // Calculate total area of tiles needed (in square meters)
  const totalTileArea = tilesNeeded * (tileLengthM * tileWidthM)

  // Calculate waste percentage (typically 10% extra for cuts and errors)
  const wastePercentage = 10
  const totalTilesWithWaste = Math.ceil(tilesNeeded * (1 + wastePercentage / 100))

  return {
    tilesNeeded,
    wholeTiles,
    cutTiles,
    edgeTiles,
    cornerTiles,
    totalTileArea,
    totalTilesWithWaste,
    tilesAlongLength,
    tilesAlongWidth,
  }
}

module.exports = { calculateTiles }
