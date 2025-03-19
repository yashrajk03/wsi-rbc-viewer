import { useState } from 'react';
import styled from 'styled-components';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import HubView from './components/HubView';
import LeftPanel from './components/LeftPanel';
import ZoomControls from './components/ZoomControls';
import outputData from './data/output.json';
import wsiImage from './assets/7_20241209_024613.png';

// Styled component for bounding boxes around detected RBCs
const BoundingBox = styled.div`
  position: absolute;
  left: ${({ x, scale, positionX }) => x * scale + positionX}px;
  top: ${({ y, scale, positionY }) => y * scale + positionY}px;
  width: ${({ width, scale }) => width * scale}px;
  height: ${({ height, scale }) => height * scale}px;
  border: 2px solid #f43f5e;
  background-color: rgba(244, 63, 94, 0.2);
  transition: all 0.2s ease-in-out;
  &:hover {
    border-color: #e11d48;
    background-color: rgba(244, 63, 94, 0.4);
  }
  .label {
    position: absolute;
    top: -1.5rem;
    left: 50%;
    transform: translateX(-50%);
    background-color: #000;
    color: #fff;
    font-size: 0.75rem;
    padding: 0.25rem 0.5rem;
    border-radius: 0.25rem;
    opacity: 0;
    transition: opacity 0.2s ease-in-out;
  }
  &:hover .label {
    opacity: 1;
  }
`;

function App() {
  const [theme, setTheme] = useState('light');
  const [pointerPosition, setPointerPosition] = useState({ x: 0, y: 0 });
  const [transformState, setTransformState] = useState({ scale: 1, positionX: 0, positionY: 0 });
  const [viewportSize, setViewportSize] = useState({ width: 288, height: 192 });

  // Parse detection results from output.json
  let detectionResults = [];
  try {
    if (!outputData.inference_results) {
      throw new Error('inference_results is missing or empty');
    }
    console.log('Raw inference_results:', outputData.inference_results);
    const cleanedInferenceResults = outputData.inference_results.replace(/'/g, '"');
    console.log('Cleaned inference_results:', cleanedInferenceResults);
    const inferenceResults = JSON.parse(cleanedInferenceResults);
    console.log('Parsed inference_results:', inferenceResults);
    console.log('inferenceResults.output:', inferenceResults.output);
    console.log('inferenceResults.output.detection_results:', inferenceResults.output?.detection_results);
    if (!inferenceResults.output || !Array.isArray(inferenceResults.output.detection_results)) {
      throw new Error('detection_results is not an array or is missing');
    }
    detectionResults = inferenceResults.output.detection_results.map(
      ([xMin, yMin, xMax, yMax, label]) => ({
        x: xMin,
        y: yMin,
        width: xMax - xMin,
        height: yMax - yMin,
        label,
      })
    );
    console.log('Number of detected RBCs:', detectionResults.length);
  } catch (error) {
    console.error('Failed to parse inference_results:', error);
    // Fallback data in case parsing fails
    detectionResults = [
      { x: 100, y: 50, width: 50, height: 50, label: 'RBC' },
      { x: 200, y: 60, width: 50, height: 50, label: 'RBC' },
      { x: 300, y: 70, width: 50, height: 50, label: 'RBC' },
    ];
    console.log('Using fallback detection results:', detectionResults);
  }

  const imageUrl = wsiImage;
  const fallbackImageUrl = 'https://via.placeholder.com/1024x512.png?text=Whole+Slide+Image+Not+Found';

  const handleImageError = (e) => {
    console.error('Failed to load Main Viewer image:', imageUrl);
    e.target.src = fallbackImageUrl;
  };

  const handleImageLoad = () => {
    console.log('Main Viewer image loaded successfully:', imageUrl);
  };

  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');

  return (
    <div className={`flex h-screen ${theme === 'dark' ? 'bg-gradient-to-br from-dark to-gray-900' : 'bg-gradient-to-br from-light to-gray-200'} transition-colors duration-300`}>
      <LeftPanel
        patientId={outputData.patient_id}
        sampleType={outputData.sample_type}
        date={outputData.date}
        rbcCount={detectionResults.length}
        theme={theme}
        toggleTheme={toggleTheme}
      />
      <div className="flex-1 relative bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden m-4">
        <TransformWrapper
          initialScale={1}
          minScale={0.5}
          maxScale={10}
          onPanning={(ref) => {
            const { positionX, positionY, scale } = ref.state;
            setTransformState({ scale, positionX, positionY });
            const newPointerPosition = {
              x: (-positionX / scale) * (288 / 1024),
              y: (-positionY / scale) * (192 / 512),
            };
            setPointerPosition(newPointerPosition);
            const viewportWidth = 288 / scale;
            const viewportHeight = 192 / scale;
            setViewportSize({ width: viewportWidth, height: viewportHeight });
            console.log('Panning - New pointer position:', newPointerPosition, 'Viewport size:', { width: viewportWidth, height: viewportHeight });
          }}
          onZoom={(ref) => {
            const { positionX, positionY, scale } = ref.state;
            setTransformState({ scale, positionX, positionY });
            const newPointerPosition = {
              x: (-positionX / scale) * (288 / 1024),
              y: (-positionY / scale) * (192 / 512),
            };
            setPointerPosition(newPointerPosition);
            const viewportWidth = 288 / scale;
            const viewportHeight = 192 / scale;
            setViewportSize({ width: viewportWidth, height: viewportHeight });
            console.log('Zooming - New pointer position:', newPointerPosition, 'Viewport size:', { width: viewportWidth, height: viewportHeight });
          }}
        >
          {({ zoomIn, zoomOut, resetTransform }) => (
            <>
              <ZoomControls zoomIn={zoomIn} zoomOut={zoomOut} reset={resetTransform} theme={theme} />
              <TransformComponent>
                <img
                  src={imageUrl}
                  alt="Whole Slide Image"
                  className="w-full h-auto"
                  onError={handleImageError}
                  onLoad={handleImageLoad}
                />
                {detectionResults.map((box, index) => (
                  <BoundingBox
                    key={index}
                    x={box.x}
                    y={box.y}
                    width={box.width}
                    height={box.height}
                    scale={transformState.scale}
                    positionX={transformState.positionX}
                    positionY={transformState.positionY}
                  >
                    <span className="label">{box.label}</span>
                  </BoundingBox>
                ))}
              </TransformComponent>
            </>
          )}
        </TransformWrapper>
      </div>
      <div className="w-72 flex flex-col bg-white dark:bg-gray-800 shadow-lg rounded-lg m-4">
        <HubView
          imageUrl={imageUrl}
          pointerPosition={pointerPosition}
          theme={theme}
          fallbackImageUrl={fallbackImageUrl}
          viewportSize={viewportSize}
        />
      </div>
    </div>
  );
}

export default App;