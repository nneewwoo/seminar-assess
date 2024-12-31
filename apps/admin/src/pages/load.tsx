import logo from "../assets/logo.png";

function App() {
  return (
    <div>
      <img src={logo} className="mx-auto my-auto" />
      <h1 className="text-3xl text-center font-bold">Seminar Assess</h1>
      <p className="text-center">
        A Mobile Application for Comprehensive Extension Training Assessment
      </p>
      <div className="flex justify-center items-center mt-4">
        <button
          type="submit"
          className="bg-amber-800 text-white p-2 rounded hover:bg-amber-900"
        >
          Log In
        </button>
      </div>
    </div>
  );
}

export default App;
