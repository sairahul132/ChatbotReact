import Chatbot from './components/Chatbot';
import '../src/App.css';

function App() {
  return (

    <div className="app-container">
      <iframe
        src="https://www.cdkglobal.com/"
        className="embedded-site"
        title="CDK Bot"
      />
      <Chatbot className="chatbot" />

    </div>
  );
}

export default App;
