import { createServer } from 'http';
import os from 'os';


const port = process.env.PORT || 3000;

// Array of HTML fragments (no DOM manipulation needed)
const surprises = [
  `<h2>🎯 Click the target!</h2>
   <div style="font-size:100px;cursor:pointer;" onclick="alert('You hit it! 🎉')">🎯</div>`,

  `<h2>😂 Joke of the moment</h2>
   <p>Why did the dolphin get a job in Kubernetes?<br>Because it already knew how to work in pods.</p>`,

  `<h2>🎨 Draw!</h2>
   <canvas id="canvas" width="300" height="300" style="border:1px solid black;"></canvas>
   <script>
      const canvas = document.getElementById('canvas');
      const ctx = canvas.getContext('2d');
      let drawing = false;
      canvas.addEventListener('mousedown',()=>drawing=true);
      canvas.addEventListener('mouseup',()=>drawing=false);
      canvas.addEventListener('mousemove',e=>{
        if(!drawing) return;
        ctx.fillRect(e.offsetX, e.offsetY, 4, 4);
      });
   </script>`,

  `<h2>🤖 Random Fact</h2>
   <p>Minikube was originally created in 2016 to make local Kubernetes testing easier!</p>`,

  `<h2>🎵 Click anywhere for a sound!</h2>
   <script>
     document.body.addEventListener('click', () => {
       new Audio("https://actions.google.com/sounds/v1/cartoon/clang_and_wobble.ogg").play();
     }, { once: true });
   </script>`
];

  
//Style from env variables
const backgroundColor = process.env.BG_COLOR || 'white';
const fontColor = process.env.FONT_COLOR || 'black';
const borderSize = process.env.BORDER_SIZE || '2px';
const borderType = process.env.BORDER_TYPE || 'dashed';
const borderColor = process.env.BORDER_COLOR || '#ccc';

function renderPage(surpriseContent) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>KubeChaos @ RSECon25</title>
  <style>
    body { font-family: 'sans-serif'; text-align: center; margin-top: 5rem; background-color: ${ backgroundColor};
    color: ${fontColor};}
    #playground { height: 400px; border: ${borderSize} ${borderType} ${borderColor}; margin-top: 20px; }
    button { padding: 10px 20px; font-size: 1rem; cursor: pointer; }
  </style>
</head>
<body>
  <h1>KubeChaos @ RSECon25!</h1>
  <p>Served by pod: <strong>${os.hostname()}</strong></p>
  <p>Every refresh brings a new surprise 🎲</p>
  <div id="playground">
    ${surpriseContent}
  </div>
</body>
</html>
`;
};

const server = createServer((_req, res) => {
  
  const randomSurprise = surprises[Math.floor(Math.random() * surprises.length)];
  res.writeHead(200, {
    'Content-Type': 'text/html',
    'Cache-Control': 'no-cache, no-store',
  });
  res.end(renderPage(randomSurprise));
});


server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
