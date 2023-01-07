import './App.css';
import ModelSquares from './ModelSquares';
import Model from './Model';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

const topText = "The following is a collection of architectures for use in Agrippa projects."

const items = [
    { id: 1, name: 'Transformer' },
    { id: 2, name: 'ResNet-18' },
    { id: 3, name: 'GAN' },
    { id: 4, name: 'Bert' },
    { id: 5, name: 'YOLOv3' },
    { id: 6, name: 'Xception' },
    { id: 7, name: 'VGG-16' },
    { id: 8, name: 'Inception-v3' },
    { id: 9, name: 'MobileNet-v2' },
    { id: 10, name: 'DenseNet' },
    { id: 11, name: 'LeNet-5' },
    { id: 12, name: 'AlexNet' },
    { id: 13, name: 'UNet' },
    { id: 14, name: 'DeepDream' },
    { id: 15, name: 'WaveNet' },
    { id: 16, name: 'Mask R-CNN' },
    { id: 17, name: 'LSTM' },
    { id: 18, name: 'GRU' },
    { id: 19, name: 'Fast R-CNN' },
    { id: 20, name: 'RNN' }
];

function App() {
    return (
        <div className="App">
            <header className="App-header">
                Agrippa Model Zoo
            </header>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={
                        <div>
                            {topText}
                            <ModelSquares items={items} />
                        </div>
                    } />
                    <Route path="/model/:id" element={
                        <Model />
                    } />
                    <Route path="*" element = {
                        <div>NOT FOUND</div>
                    } />
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;
