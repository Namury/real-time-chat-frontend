function App() {
  return (
    <div className="App">
      <header className="text-3xl font-bold underline text-center">
          Real Time Chat
      </header>
      <div class="grid grid-cols-2 border">
        <div class="grid grid-rows-2">
          <div class="row-span-2">
            lorem1: Lorem Ipsum Dolor Sit Amet<br/>
            lorem2: Dolor Sit Amet Lorem Ipsum<br/>
            lorem1: Lorem Ipsum Dolor Sit Amet<br/>
            lorem2: Dolor Sit Amet Lorem Ipsum<br/>
            lorem1: Lorem Ipsum Dolor Sit Amet<br/>
            lorem2: Dolor Sit Amet Lorem Ipsum<br/>
            lorem1: Lorem Ipsum Dolor Sit Amet<br/>
            lorem2: Dolor Sit Amet Lorem Ipsum<br/>
            lorem1: Lorem Ipsum Dolor Sit Amet<br/>
            lorem2: Dolor Sit Amet Lorem Ipsum<br/>
            lorem1: Lorem Ipsum Dolor Sit Amet<br/>
            lorem2: Dolor Sit Amet Lorem Ipsum<br/>
          </div>
          <div class="grid grid-cols-3">
            <input type="textarea" class="form-textarea col-span-2"/> 
            <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold rounded">
              Button
            </button>
          </div>
        </div>
        <div class="grid grid-rows-2 gap-4">
          <video class="h-fit aspect-video" autoplay playsinline poster="https://thetechnoskeptic.com/wp-content/uploads/2018/05/BlackBoxComposite_iStock_leolintangivanmollov_900.jpg"></video>
          <video class="h-full aspect-video" autoplay playsinline poster="https://thetechnoskeptic.com/wp-content/uploads/2018/05/BlackBoxComposite_iStock_leolintangivanmollov_900.jpg"></video>
        </div>
      </div>
    </div>
  );
}

export default App;
