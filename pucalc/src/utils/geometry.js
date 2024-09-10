
// Function to invert coordinate pairs
function invertCoordinates(coords) {
    return coords.map(polygon =>
        polygon.map(ring =>
            ring.map(coord => [coord[1], coord[0]])
        )
    );
}

export default invertCoordinates;