import styled from 'styled-components';

// Styled component for the pointer in Hub View
const Pointer = styled.div`
  position: absolute;
  width: 12px;
  height: 12px;
  left: ${({ x }) => x + 144}px; /* 288 / 2 */
  top: ${({ y }) => y + 96}px; /* 192 / 2 */
  transform: translate(-50%, -50%);
`;

// Styled component for the viewport rectangle in Hub View
const Viewport = styled.div`
  position: absolute;
  left: ${({ x }) => x + 144}px;
  top: ${({ y }) => y + 96}px;
  width: ${({ width }) => width}px;
  height: ${({ height }) => height}px;
  transform: translate(-50%, -50%);
  border: 2px solid #f43f5e;
  background-color: rgba(244, 63, 94, 0.1);
`;

function HubView({ imageUrl, pointerPosition, theme, fallbackImageUrl, viewportSize }) {
  const handleImageError = (e) => {
    console.error('Failed to load Hub View image:', imageUrl);
    e.target.src = fallbackImageUrl;
  };

  const handleImageLoad = () => {
    console.log('Hub View image loaded successfully:', imageUrl);
  };

  console.log('HubView - Current pointer position:', pointerPosition);

  return (
    <div className="h-48 relative bg-gray-200 dark:bg-gray-700 rounded-t-lg overflow-hidden shadow-inner border border-gray-300 dark:border-gray-600">
      <img
        src={imageUrl}
        alt="Hub View"
        className="w-full h-full object-cover opacity-90"
        onError={handleImageError}
        onLoad={handleImageLoad}
      />
      <Viewport
        x={pointerPosition.x}
        y={pointerPosition.y}
        width={viewportSize.width}
        height={viewportSize.height}
      />
      <Pointer
        x={pointerPosition.x}
        y={pointerPosition.y}
        className="bg-accent rounded-full shadow-lg border-2 border-white dark:border-gray-300 transition-all duration-100"
      />
    </div>
  );
}

export default HubView;